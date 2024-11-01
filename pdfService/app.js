const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const mainMiddleWare = require("./middlewares/mainMiddleware");

require("dotenv").config();



app.set('view engine', 'ejs');
app.set("views" , "templates");


const uploadDir = path.join(__dirname, 'uploads/pdf/');
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

app.post('/upload-pdf', upload.single('file'), async (req, res) => {
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
        await mainMiddleWare(file.filename);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the file');
    }
});


app.get("/" , (req, res) => {
  res.render("deneme");
} )



// (async () => {
//      try {
//        const pages = await pdfProcessor("pdf2.pdf");
//        console.log(pages);    
//        // pages değişkenini burada kullanarak diğer işlemleri yapabilirsiniz.
//        await pptxGenerator(themeList[0], layoutlist, pages);
//        console.log("Presentation created successfully!");
//      } catch (error) {
//        console.error("An error occurred:", error);
//      }
// })();

app.listen(process.env.PORT, (req , res) => {
    console.log("app has started");
})