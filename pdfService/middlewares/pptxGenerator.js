const pptxGenJs = require("pptxgenjs");

const Theme = require("../utils/theme");
const Layout = require("../utils/layout");
const ContentArea = require("../utils/contentArea");

const createSlide = async (theme, layouts, pages, filename) => {
  const pptx = new pptxGenJs();
  const filepath = "uploads/pptx/" + filename + ".pptx";

  pages.forEach((page, index) => {
    // Find appropriate layout based on content length and type
    let layout = layouts.find(l => 
      l.contentAreas.length === page.textArray.length && 
      l.type === (page.type || "bullet") // Default to "bullet" if type not specified
    );

    if (layout) {
      const slide = pptx.addSlide();

      // Add subtitle
      slide.addText(page.subtitle, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 1.0,
        fontSize: 32,
        fontFace: theme.fonts[0],
        color: theme.fontcolors[0],
        align: "left",
      });

      // Add main title with different positioning based on type
      const mainTitleConfig = {
        fontSize: 20,
        fontFace: theme.fonts[0],
        color: theme.fontcolors[1],
        align: "left",
      };

      if (layout.type === "comparison") {
        Object.assign(mainTitleConfig, {
        x: 8,
        y: 5,
        w: 4,
        h: 0.5,
        });
      } else {
        Object.assign(mainTitleConfig, {
          x: 8,
          y: 5,
          w: 4,
          h: 0.5,
        });
      }

      slide.addText(page.mainTitle, mainTitleConfig);

      // Add content based on layout type
      page.textArray.forEach((text, i) => {
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

        // Apply type-specific formatting
        switch (layout.type) {
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

      // Add background
      slide.background = { color: theme.backgrounds[2] };

      // Add vertical lines for comparison layout
      if (layout.type === "comparison" && page.textArray.length === 2) {
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
      } else if (layout.type === "comparison" && page.textArray.length === 3) {
        // Add two vertical lines for three columns
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
    } else {
      console.error(`Layout not found for page ${index} (type: ${page.type || "bullet"})`);
    }
  });

  await pptx.writeFile({ fileName: filepath });
  console.log("finished");
  return filepath;
};

module.exports = createSlide;