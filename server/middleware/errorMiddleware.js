const multer = require('multer');

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  let status = 500;
  let message = err.message || 'Server error';

  if (err instanceof multer.MulterError) {
    status = 400;
    if (err.code === 'LIMIT_FILE_SIZE') message = 'Image must be 5 MB or smaller';
  } else if (message === 'Only image files are allowed') {
    status = 400;
  }

  res.status(status).json({ success: false, message });
};

module.exports = { notFound, errorHandler };