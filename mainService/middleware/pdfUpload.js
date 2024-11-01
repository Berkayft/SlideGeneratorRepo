const path = require('path');
const fs = require('fs');
const multer = require("multer");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = 'uploads/pdf/';
      // Uploads klasörü yoksa oluştur
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // Dosya adını timestamp ile birlikte kaydet
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Sadece PDF dosyaları yüklenebilir!'), false);
    }
  };

const Pdfupload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 30 * 1024 * 1024 // 5MB limit
    }
  });

module.exports = Pdfupload;