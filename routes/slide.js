const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require('fs');
const PPTX = require('nodejs-pptx'); // Bu modülü yüklediğinizden emin olun: npm install nodejs-pptx




// Uploads klasörü oluşturma
const uploadsDir = path.join(__dirname,"..", 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}


router.get("/slide" , (req , res) => {
    res.render("slideMenu");
})

// PowerPoint oluşturma fonksiyonu

// Route tanımlamaları
router.get('/create-presentation', async (req, res) => {
    let pptx = new PPTX.Composer();

    await pptx.compose(pres => {
        pres.addSlide(slide => {
            slide.addText(text => {
            text.value('Hello World');
        });
    });
    res.render("slideMenu");
});
const unique = path.join(uploadsDir,String(Date.now())+".pptx")
await pptx.save(unique);
});

// Diğer route'lar...



module.exports = router;