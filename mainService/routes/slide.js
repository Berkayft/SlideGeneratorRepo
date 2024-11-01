const express = require("express");
const router = express.Router();
const uploadPdf = require("../middleware/pdfUpload");
const sendPdf = require("../middleware/pdfSend");
const fs = require("fs");
const { User , SlideModel } = require("../models/Model");
const isAuthenticated = require("../middleware/authMiddleware");

// Diğer route'lar...
router.get("/generation" , (req , res) => {
    res.render("uploadPdf");
})




router.post('/upload', isAuthenticated ,uploadPdf.single('pdf'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenemedi' });
    }
    const title = req.body.name;
    const description = req.body.description;
    const user = await User.findById(req.user._id);
    const slideModel = await SlideModel.create({
      title: title,
      description: description,
      user: user._id // yalnızca user ID eklenir
    });
    user.slides.push(slideModel._id);
    await user.save();
    await sendPdf(req.file.filename);
    res.redirect("/profile");
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