const pptxGenJs = require("pptxgenjs");

const Theme = require("../utils/theme");
const Layout = require("../utils/layout");
const ContentArea = require("../utils/contentArea");

const createSlide = async (theme, layouts, pages, filename) => {
    const pptx = new pptxGenJs();
    const filepath = "uploads/pptx/" + filename + ".pptx";

    pages.forEach((page, index) => {
        let layout = null;
        for (let i = 0; i < layouts.length; i++) {
            if (layouts[i].contentAreas.length === page.textArray.length) {
                layout = layouts[i];
                // Layout bulunduğunda, burada loglayabiliriz
                console.log(`Page  using layout: ${layout.name}`);
                break; // Layout bulunduğunda döngüden çıkıyoruz
            }
        }

        if (layout) {
            const slide = pptx.addSlide();

            // Ana başlık ekleme
            slide.addText(page.mainTitle, {
                x: 0.5, // inç olarak orta konum (slaytın genişliği tipik olarak 10 inçtir)
                y: 0.5,
                w: 9,
                h: 1.0, // yükseklik eklendi
                fontSize: 32,
                fontFace: theme.fonts[0],
                color: theme.fontcolors[0],
                align: "left", // options altına değil, doğrudan yazılmalı
            });

            // İçerik ekleme
            page.textArray.forEach((text, i) => {
                slide.addText(text, {
                    x: layout.contentAreas[i].x,
                    y: layout.contentAreas[i].y,
                    w: layout.contentAreas[i].w, // genişlik eklendi
                    h: layout.contentAreas[i].h, // yükseklik eklendi
                    fontSize: 14,
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
