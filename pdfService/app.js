const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const mainMiddleWare = require("./middlewares/newMainMiddleware");

require("dotenv").config();



app.set('view engine', 'ejs');
app.set("views" , "templates");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

const checkMiddleware = (req , res ,next) => {
    console.log("post request came");
    next();
}

app.post('/upload-pdf' , upload.single('file'), async (req, res) => {
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
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the file');
    }
});

// body-parser middleware'ini ekleyin


app.post("/startProcess", async (req, res) => {
    try {
        console.log(req.body.texts);
        const outputFileName = path.parse(req.body.texts[0]).name;
        const texts = req.body.texts;
        const themecode = texts.pop();
        console.log(themecode);
        console.log(texts);
        const pdfPathList = texts.map(element => "uploads/pdf/" + element);
        await mainMiddleWare(pdfPathList,outputFileName,themecode);
        res.status(200).send({ message: "Process started successfully." });
    } catch (error) {
        console.log("Error in /startProcess:", error);
        res.status(500).send({ error: "An error occurred while processing the request." });
    }
});

app.get("/" , (req, res) => {
  res.render("deneme");
} )

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

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