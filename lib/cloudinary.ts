import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary with optimization.
 * Supports base64 strings or file paths.
 */
export const uploadImage = async (
  file: string,
  folder: 'products' | 'users' | 'misc' = 'misc',
  options?: Partial<UploadApiOptions>
): Promise<UploadApiResponse> => {
  try {
    const defaultOptions: UploadApiOptions = {
      folder: `xyoma/${folder}`,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      ...options,
    };

    const result = await cloudinary.uploader.upload(file, defaultOptions);
    return result;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Deletes an image from Cloudinary using its public ID.
 */
export const deleteImage = async (publicId: string): Promise<{ result: string }> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

/**
 * Generates an optimized URL for a given public ID with specific transformations.
 */
export const getOptimizedUrl = (publicId: string, width = 800, height = 800): string => {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'center',
    quality: 'auto',
    fetch_format: 'auto',
  });
};

export default cloudinary;
