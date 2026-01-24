import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

export const courseCloudStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video');

    return {
      folder: 'courses',  
      resource_type: isVideo ? 'video' : 'image',
      public_id: `${Date.now()}-${file.originalname}`,  
    };
  },
});