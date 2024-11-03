const titleExtractor = require("./titleExtractor");
const pageContentCreator = require("./pageContentCreator");
const pptxGenerator = require("./pptxGenerator");
const sendPptx = require("./sendPptx");

const themes = require("../manual/themes");
const layouts = require("../manual/layouts");

const ProcessSequent = async(pdflist,outputFileName,themeCode) => {
    try {
        const result = await titleExtractor(pdflist);
        console.log("finished titles");
        const pages = await pageContentCreator(pdflist,result);
        const intTheme = parseInt(themeCode,10);
        console.log("finished pages");
        console.log(JSON.stringify(pages));
        const pptx = await pptxGenerator(themes[intTheme],layouts,pages,outputFileName);
        await sendPptx(pptx);
        console.log("finished");
    }catch(error) {
        console.log(error);
    }
}

module.exports = ProcessSequent;