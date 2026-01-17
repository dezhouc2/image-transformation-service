export interface ProcessedImage {
  id: string;
  originalName: string;
  processedUrl: string;
  publicId: string;
  createdAt: Date;
}

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  data?: ProcessedImage;
  error?: string;
}

export interface ImageDeleteResponse {
  success: boolean;
  message: string;
  error?: string;
}
