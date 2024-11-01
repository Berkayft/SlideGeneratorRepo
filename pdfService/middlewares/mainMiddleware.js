const PdfProcessor = require("./pdfProcessor");
const pptxProcessor = require("./pptxGenerator");
const sendPptx = require("./sendPptx");

const layoutlist = require("../manual/layouts");
const themeList = require("../manual/themes");


const main = async (filepath) => {
    const filename = "uploads/pdf/"+filepath;
    const parsedName = filepath.replace('.pdf', '');
    console.log(filename);
    result = await PdfProcessor(filename);
    const pptxFilePath = await pptxProcessor(themeList[0],layoutlist,result,parsedName);
    await sendPptx(pptxFilePath);
    console.log(pptxFilePath); 
}


module.exports = main;