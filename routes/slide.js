const express = require("express");
const router = express.Router();
const uploadPdf = require("../middleware/pdfUpload");
const fs = require("fs");

// Diğer route'lar...
router.get("/generation" , (req , res) => {
    res.render("uploadPdf");
})




router.post('/upload', uploadPdf.single('pdf'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenemedi' });
    }
    res.json({ 
      message: 'Dosya başarıyla yüklendi',
      filename: req.file.filename
    });
  });


router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
  
    // Dosyanın varlığını kontrol et
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Dosya bulunamadı' });
    }
  
    res.download(filePath);
  });
  
  // Yüklenen dosyaları listele
router.get('/files', (req, res) => {
    const uploadDir = 'uploads/';
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Dosyalar listelenemedi' });
      }
      res.json(files);
    });
  });




module.exports = router;