const path = require('path');
const fs = require('fs');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/pdf/';
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create directory recursively
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Save the file with a timestamp and user ID
    cb(null, Date.now() + '-' + req.user.id + ".pdf");
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const Pdfupload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024 // 30MB limit
  }
});


module.exports = Pdfupload;
