const titleExtractor = require("./titleExtractor");
const pageContentCreator = require("./pageContentCreator");
const pptxGenerator = require("./pptxGenerator");
const sendPptx = require("./sendPptx");


const ProcessSequent = async(pdflist) => {
    try {
        const result = await titleExtractor(pdflist);
        console.log(JSON.stringify(result));
        const pages = await pageContentCreator(pdfs,result);
        console.log(JSON.stringify(pages));
        const pptx = await pptxGenerator(pages);
        await sendPptx(pptx);
        console.log("finished");
    }catch(error) {
        console.log(error);
    }
}

module.exports = ProcessSequent;