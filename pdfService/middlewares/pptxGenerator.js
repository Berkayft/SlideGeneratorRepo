const pptxGenJs = require("pptxgenjs");

const Theme = require("../utils/theme");
const Layout = require("../utils/layout");
const ContentArea = require("../utils/contentArea");







const createSlide = async (theme, layouts, pages,filename) => {
    const pptx = new pptxGenJs();
    const filepath = "uploads/pptx/"+filename+".pptx";

    pages.forEach((page, index) => {
      
      let layout = null;
      for (let i = 0; i < layouts.length; i++) {
        if (layouts[i].contentAreas.length === page.textArray.length) {
          layout = layouts[i];
          break;
        }
      }

      if (layout) {
        const slide = pptx.addSlide();

        // Ana başlık ekleme
        slide.addText(page.mainTitle, {
          x: "50%",
          y: 1,
          fontSize: 24,
          fontFace: theme.fonts[0],
          color: theme.fontcolors[0],
          options: {
            align:"center",
          }
        });

        // İçerik ekleme
        page.textArray.forEach((text, i) => {
          slide.addText(text, {
            x: layout.contentAreas[i].x,
            y: layout.contentAreas[i].y,
            fontSize: 18,
            fontFace: theme.fonts[0],
            color: theme.fontcolors[0],
          });
        });

        // Arka plan rengi ekleme
        slide.background = { color: theme.backgrounds[0] };
      } else {
        console.error(`Layout not found for page ${index}`);
      }
    });

    await pptx.writeFile({ fileName: filepath });
    console.log("finished");
    return filepath;
};





module.exports = createSlide;