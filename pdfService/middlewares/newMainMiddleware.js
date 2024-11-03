const titleExtractor = require("./titleExtractor");
const pageContentCreator = require("./pageContentCreator");
const pptxGenerator = require("./pptxGenerator");
const sendPptx = require("./sendPptx");

const themes = require("../manual/themes");
const layouts = require("../manual/layouts");

const ProcessSequent = async(pdflist,outputFileName) => {
    try {
        const result = await titleExtractor(pdflist);
        console.log("finished titles");
        const pages = await pageContentCreator(pdflist,result);
        console.log("finished pages");
        console.log(JSON.stringify(pages));
        const pptx = await pptxGenerator(themes[0],layouts,pages,outputFileName);
        await sendPptx(pptx);
        console.log("finished");
    }catch(error) {
        console.log(error);
    }
}

module.exports = ProcessSequent;