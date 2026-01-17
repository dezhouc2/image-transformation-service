import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { processImage } from '../services/imageProcessor';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary';
import { ProcessedImage, ImageUploadResponse, ImageDeleteResponse } from '../types';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
    }
  },
});

// In-memory storage for processed images (in production, use a database)
const processedImages: Map<string, ProcessedImage> = new Map();

// POST /api/images/upload - Upload and process an image
router.post(
  '/upload',
  upload.single('image'),
  async (req: Request, res: Response<ImageUploadResponse>) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided',
          error: 'Please upload an image file',
        });
      }

      console.log(`Processing image: ${req.file.originalname}`);

      // Process the image (remove background + flip)
      const processedBuffer = await processImage(req.file.buffer);

      // Generate unique ID for this image
      const imageId = uuidv4();

      // Upload to Cloudinary
      const { url, publicId } = await uploadToCloudinary(processedBuffer, imageId);

      // Store image metadata
      const imageData: ProcessedImage = {
        id: imageId,
        originalName: req.file.originalname,
        processedUrl: url,
        publicId: publicId,
        createdAt: new Date(),
      };

      processedImages.set(imageId, imageData);

      console.log(`Image processed successfully: ${imageId}`);

      return res.status(200).json({
        success: true,
        message: 'Image processed successfully',
        data: imageData,
      });
    } catch (error) {
      console.error('Error processing image:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to process image',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

// GET /api/images/:id - Get a processed image by ID
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const image = processedImages.get(id);

  if (!image) {
    return res.status(404).json({
      success: false,
      message: 'Image not found',
    });
  }

  return res.status(200).json({
    success: true,
    data: image,
  });
});

// GET /api/images - Get all processed images
router.get('/', (_req: Request, res: Response) => {
  const images = Array.from(processedImages.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return res.status(200).json({
    success: true,
    data: images,
  });
});

// DELETE /api/images/:id - Delete a processed image
router.delete('/:id', async (req: Request, res: Response<ImageDeleteResponse>) => {
  try {
    const { id } = req.params;
    const image = processedImages.get(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
        error: 'The requested image does not exist',
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(image.publicId);

    // Remove from memory storage
    processedImages.delete(id);

    console.log(`Image deleted successfully: ${id}`);

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
