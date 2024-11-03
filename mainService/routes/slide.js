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
const imagecreator = require("../middleware/imageCreator");
const themelist = require("../manual/themes");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
// Diğer route'lar...

router.get("/slideGenerationPage", async (req, res) => {

  
  try {
    const user = await User.findById(req.user._id);
    if(user.tokenCount < 1){
      return res.status(403).send("Yeterli token yok. Lütfen token satın alın.");
    }
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
  console.log(name);
  const creatingSlide = await SlideModel.findOne({
    user: req.user._id,
    status: "Creating"
  });

  if (!creatingSlide) {
    return res.status(404).json({ error: 'Slide not found or not in creating status' });
  }
  const filepath = creatingSlide.pdfPathList[0].replace(".pdf","");
  creatingSlide.title = name;
  creatingSlide.description = description;
  creatingSlide.theme = theme; // Store selected theme
  creatingSlide.status = "Evaluating";
  creatingSlide.filepath = filepath;
  creatingSlide.imageUrl = await imagecreator(name, themelist[theme] , filepath);
  await creatingSlide.save();

  const pdfPaths = creatingSlide.pdfPathList;
  console.log(pdfPaths);
  const user = await User.findById(req.user._id);
  user.tokenCount -= 1;
  await user.save();
  await sendMultiplePDF(pdfPaths);
  pdfPaths.push(theme);
  await startProcess(pdfPaths);
  res.redirect("/profile");
});

router.get('/download/:filename', async (req, res) => {
    const filename = req.params.filename.replace(".pptx","");
    const filePath = path.join('uploads',"pptx", filename+".pptx");
    console.log(filePath);
    // Dosyanın varlığını kontrol et

    const slide = await SlideModel.findOne({ filepath: filename }).exec();
    const user = await User.findById(req.user._id);
    if(user._id.toString() !== slide.user.toString()){
      slide.downloadCount += 1;
      await slide.save();
    }

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