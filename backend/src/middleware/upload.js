const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage, upload to cloudinary manually in controller
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only images and PDF files allowed'));
  },
});

// KYC upload — accepts images and PDFs
const kycUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only images and PDFs allowed'));
  },
});

const uploadToCloudinary = (buffer, mimetype, retries = 3) => {
  return new Promise((resolve, reject) => {
    const isPdf = mimetype === 'application/pdf';
    
    const attemptUpload = (attemptsLeft) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'INFRAALL',
          resource_type: isPdf ? 'raw' : 'image',
          timeout: 60000, // 60 second timeout
        },
        (error, result) => {
          if (error) {
            console.error(`Upload attempt failed (${retries - attemptsLeft + 1}/${retries}):`, error.message);
            
            if (attemptsLeft > 0 && (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT')) {
              console.log(`Retrying upload... (${attemptsLeft} attempts left)`);
              setTimeout(() => attemptUpload(attemptsLeft - 1), 2000); // Wait 2 seconds before retry
            } else {
              reject(error);
            }
          } else {
            resolve(result.secure_url);
          }
        }
      );
      
      // Set a timeout for the stream
      const timeout = setTimeout(() => {
        stream.destroy();
        reject(new Error('Upload timeout - please try again with a smaller file'));
      }, 65000); // 65 seconds (slightly more than Cloudinary timeout)
      
      stream.on('finish', () => clearTimeout(timeout));
      stream.on('error', () => clearTimeout(timeout));
      
      stream.end(buffer);
    };
    
    attemptUpload(retries - 1);
  });
};

module.exports = { upload, kycUpload, uploadToCloudinary };

