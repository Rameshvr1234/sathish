const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (we'll upload to S3)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed extensions
  const allowedExtensions = /jpeg|jpg|png|gif|pdf|doc|docx/;

  // Check extension
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

  // Check mime type
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, DOC, DOCX are allowed'));
  }
};

// Upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: fileFilter
});

module.exports = upload;
