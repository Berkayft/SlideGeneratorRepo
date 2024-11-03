const express = require("express");
const router = express.Router();
const uploadPdf = require("../middleware/pdfUpload");
const { sendMultiplePDF , startProcess} = require("../middleware/pdfSend");
const fs = require("fs");
const { User , SlideModel } = require("../models/Model");
const isAuthenticated = require("../middleware/authMiddleware");
const { spendToken } = require("../middleware/moneyMiddleware");
const path = require("path");
const { Slide } = require("nodejs-pptx");


router.use(express.urlencoded({ extended: true }));
router.use(express.json());
// Diğer route'lar...

router.get("/slideGenerationPage", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check for an existing slide with status "Creating"
    const creatingSlide = await SlideModel.findOne({
      user: req.user._id,
      status: "Creating"
    });

    if (creatingSlide) {
      // Remove the creatingSlide from the user's slides
      console.log(creatingSlide.pdfPathList.length);
      user.slides = user.slides.filter(slideId => !creatingSlide._id.equals(slideId));
      await user.save();
      await SlideModel.deleteOne({ _id: creatingSlide._id });
      
      console.log("Deleted existing creating slide");
    }

    // Create a new slide model
    const slideModel = await SlideModel.create({
      user: user._id,
      status: "Creating",
      pdfPathList: [] // Initialize with an empty list for PDF paths
    });

    user.slides.push(slideModel._id);
    await user.save();

    res.render("slideGenerationPage");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while accessing the slide generation page.");
  }
});

router.post('/upload', uploadPdf.single('pdf'), async (req, res) => {
  console.log("gell");
  if (!req.file) {
    return res.status(400).json({ error: 'File upload failed' });
  }

  const creatingSlide = await SlideModel.findOne({
    user: req.user._id,
    status: "Creating"
  });
  console.log(creatingSlide.pdfPathList.length);
  if (!creatingSlide) {
    return res.status(404).json({ error: 'Slide not found or not in creating status' });
  }

  creatingSlide.pdfPathList.push(req.file.filename);
  console.log(req.file.filename);
  await creatingSlide.save();
  
  res.status(200).json({ message: 'PDF uploaded successfully' });
});

router.post("/startGeneration", async (req, res) => {
  const { name, description, theme } = req.body;
  
  const creatingSlide = await SlideModel.findOne({
    user: req.user._id,
    status: "Creating"
  });

  if (!creatingSlide) {
    return res.status(404).json({ error: 'Slide not found or not in creating status' });
  }

  creatingSlide.title = name;
  creatingSlide.description = description;
  creatingSlide.theme = theme; // Store selected theme
  creatingSlide.status = "Evaluating";
  await creatingSlide.save();

  const pdfPaths = creatingSlide.pdfPathList;
  console.log(pdfPaths);
  await sendMultiplePDF(pdfPaths);
  await startProcess(pdfPaths);
  res.redirect("/profile");
});

router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join('uploads',"pptx", filename);
    console.log(filePath);
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