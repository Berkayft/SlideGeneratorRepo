const pptxGenJs = require("pptxgenjs");

const Theme = require("../utils/theme");
const Layout = require("../utils/layout");
const ContentArea = require("../utils/contentArea");




const createSlide = async (theme, layouts, generalPages, filename) => {
  const pptx = new pptxGenJs();
  const filepath = "uploads/pptx/" + filename + ".pptx";

  for(let i = 0; i < generalPages.length; i++) {
    const pageData = generalPages[i][0]; // { pageContents: [...] }
    const title = generalPages[i][1];    // başlık string'i
    
    // pageContents dizisindeki her bir sayfa için
    pageData.pageContents.forEach((page, index) => {
      // TextType'ı layout type'a dönüştür
      let layoutType = page.TextType.toLowerCase();
      if (layoutType === "listed text") layoutType = "bullet";
      else if (layoutType === "paragraphs") layoutType = "paragraph";
      else if (layoutType === "comparision") layoutType = "comparison";

      // Layout'u bul
      let layout = layouts.find(l => 
        l.contentAreas.length === page.Texts.length && 
        l.type === layoutType
      );

      if (layout) {
        const slide = pptx.addSlide();

        // HeadingOfPage'i subtitle olarak ekle
        slide.addText(page.HeadingOfPage, {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 1.0,
          fontSize: 32,
          fontFace: theme.fonts[0],
          color: theme.fontcolors[0],
          align: "left",
        });

        // Ana başlığı ekle
        const mainTitleConfig = {
          fontSize: 20,
          fontFace: theme.fonts[0],
          color: theme.fontcolors[1],
          align: "center",
          x: 6.8,
          y: 4.8,
          w: 4,
          h: 0.5,
        };

        slide.addText(title, mainTitleConfig);

        // İçeriği layout type'a göre ekle
        page.Texts.forEach((text, i) => {
          const area = layout.contentAreas[i];
          const textOptions = {
            x: area.x,
            y: area.y,
            w: area.w,
            h: area.h,
            fontSize: area.options?.fontSize || 14,
            fontFace: theme.fonts[0],
            valign: "top",
            color: area.options?.color || theme.fontcolors[3],
            bold: area.options?.isBold || false,
            align: area.options?.align || "left",
          };

          // Layout type'a göre özel formatlama
          switch (layoutType) {
            case "bullet":
              Object.assign(textOptions, {
                bullet: true,
                bulletSize: area.options?.bulletSize || 90,
                bulletIndent: area.options?.bulletIndent || 0.3,
                bulletColor: area.options?.bulletColor || theme.fontcolors[3],
              });
              break;

            case "comparison":
              Object.assign(textOptions, {
                align: area.options?.align || "left",
                bullet: false,
              });
              break;

            case "paragraph":
              Object.assign(textOptions, {
                align: "justify",
                bullet: false,
              });
              break;
          }

          slide.addText(text, textOptions);
        });

        // Arka plan ekle
        slide.background = { color: theme.backgrounds[2] };

        // Karşılaştırma layout'u için dikey çizgiler
        if (layoutType === "comparison") {
          if (page.Texts.length === 2) {
            slide.addShape(pptx.ShapeType.line, {
              x: 4.8,
              y: 1.5,
              w: 0,
              h: 4,
              line: {
                color: theme.fontcolors[2],
                width: 1,
              },
            });
          } else if (page.Texts.length === 3) {
            slide.addShape(pptx.ShapeType.line, {
              x: 3.4,
              y: 1.5,
              w: 0,
              h: 4,
              line: {
                color: theme.fontcolors[2],
                width: 1,
              },
            });
            slide.addShape(pptx.ShapeType.line, {
              x: 6.8,
              y: 1.5,
              w: 0,
              h: 4,
              line: {
                color: theme.fontcolors[2],
                width: 1,
              },
            });
          }
        }
      } else {
        console.error(`Layout not found for page ${index} (type: ${layoutType})`);
      }
    });
  }

  await pptx.writeFile({ fileName: filepath });
  console.log("finished");
  return filepath;
}

module.exports = createSlide;