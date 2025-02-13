import multer from 'multer';
import path from 'path';

// Define file types allowed (image and video)
const fileTypes = /jpeg|jpg|png|gif|mp4|avi|mov/;

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the filename
  },
});

// File filter to accept only specific image/video formats
const fileFilter = (req, file, cb) => {
  if (!fileTypes.test(path.extname(file.originalname).toLowerCase())) {
    return cb(new Error('Invalid file type. Only images and videos are allowed.'));
  }
  cb(null, true); // Accept the file
};

const upload = multer({ storage, fileFilter });

export default upload;