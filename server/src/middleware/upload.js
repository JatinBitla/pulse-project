const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pulse_posts',
    allowed_formats: ['jpg', 'png', 'jpeg'], // Security: restrict file types 
    transformation: [{ width: 1080, height: 1080, crop: 'limit' }] // Optimize for IG style
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for security 
});

module.exports = upload;