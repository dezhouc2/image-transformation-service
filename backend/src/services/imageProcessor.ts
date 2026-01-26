import sharp from 'sharp';

export const removeBackground = async (imageBuffer: Buffer): Promise<Buffer> => {
  const apiKey = process.env.REMOVE_BG_API_KEY;
  
  if (!apiKey) {
    throw new Error('REMOVE_BG_API_KEY is not configured');
  }

  const formData = new FormData();
  formData.append('image_file', new Blob([imageBuffer]), 'image.png');
  formData.append('size', 'auto');

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Background removal failed: ${response.status} - ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export const flipImageHorizontally = async (imageBuffer: Buffer): Promise<Buffer> => {
  return sharp(imageBuffer).flop().png().toBuffer();
};

export const processImage = async (imageBuffer: Buffer): Promise<Buffer> => {
  // Step 1: Remove background
  console.log('Removing background...');
  const backgroundRemovedBuffer = await removeBackground(imageBuffer);

  // Step 2: Flip horizontally
  console.log('Flipping image horizontally...');
  const flippedBuffer = await flipImageHorizontally(backgroundRemovedBuffer);

  return flippedBuffer;
};
