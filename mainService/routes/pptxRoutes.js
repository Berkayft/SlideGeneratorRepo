const express = require("express");
const router = express();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { User , SlideModel } = require("../models/Model");


const uploadDir = path.join('uploads/pptx/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Dosyaları 'uploads/pdf/' dizinine kaydet
    },
    filename: (req, file, cb) => {
        // Dosya adını isterseniz burada özelleştirebilirsiniz
        cb(null, file.originalname); // Orijinal dosya adıyla kaydet
    }
});

const upload = multer({ storage });

router.post('/upload-pptx', upload.single('file'), async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).send('No Authorization header provided.');
        }

        const token = authHeader.split(' ')[1]; // "Bearer" kısmını ayırarak yalnızca token'ı alın
        console.log('Received token:', token);

        const file = req.file;

        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        console.log('File received:', file);

        // Dosya içeriğini işlemek, taşımak veya başka bir yerde kullanmak için burada işlem yapabilirsiniz

        res.status(200).send('File received successfully');

        console.log(file.filename);
        user_id = file.filename.split('-')[1].split('.')[0];
        const user = await User.findById(user_id);
        const slide_id = user.slides[user.slides.length-1];
        const theslide = await SlideModel.findById(slide_id);
        theslide.filepath = file.filename;
        theslide.status = "Ready";
        await theslide.save();

        //DB işlemleri

    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the file');
    }
});



module.exports = router;