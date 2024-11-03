const Layout = require("../utils/layout");
const ContentArea = require("../utils/contentArea");
const createSlide = require("../middlewares/pptxGenerator");
const themelist = require("../manual/themes");
const { text } = require("express");
const theme = themelist[1];

// Bullet (previously "list") type layouts
const fiveLineLayout = new Layout("5 line", [
  new ContentArea("text", 0.5, 1.5, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 }),
  new ContentArea("text", 0.5, 2.2, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 }),
  new ContentArea("text", 0.5, 2.9, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 }),
  new ContentArea("text", 0.5, 3.6, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 }),
  new ContentArea("text", 0.5, 4.3, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 })
], "bullet");

const fourLineLayout = new Layout("4 line", [
  new ContentArea("text", 0.5, 1.5, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 }),
  new ContentArea("text", 0.5, 2.2, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 }),
  new ContentArea("text", 0.5, 2.9, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 }),
  new ContentArea("text", 0.5, 3.6, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 })
], "bullet");

const threeLineLayout = new Layout("3 line", [
  new ContentArea("text", 0.5, 1.5, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 }),
  new ContentArea("text", 0.5, 2.2, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 }),
  new ContentArea("text", 0.5, 2.9, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 })
], "bullet");

const twoLineLayout = new Layout("2 line", [
  new ContentArea("text", 0.5, 1.5, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 }),
  new ContentArea("text", 0.5, 2.2, 9.3, 0.7, { bullet: true, bulletSize: 90, bulletIndent: 0.3 })
], "bullet");

// Paragraph type layouts
const oneLineLayout = new Layout("1 line", [
  new ContentArea("text", 0.5, 1.5, 9.3, 3.6, { align: 'justify' })
], "paragraph");

// Comparison type layouts
const twoColumnLayout = new Layout("2 column comparison", [
  new ContentArea("text", 0.3, 1.5, 4.2, 3.4),
  new ContentArea("text", 5.1, 1.5, 4.2, 3.4)
], "comparison");

const threeColumnLayout = new Layout("3 column comparison", [
  new ContentArea("text", 0.5, 1.5, 2.8, 0.7),
  new ContentArea("text", 3.8, 1.5, 2.8, 0.7),
  new ContentArea("text", 7.1, 1.5, 2.8, 0.7)
], "comparison");

// Layout list including all types
const layoutlist = [
  fiveLineLayout,
  fourLineLayout,
  threeLineLayout,
  twoLineLayout,
  oneLineLayout,
  twoColumnLayout,
  threeColumnLayout
];

// Updated mock pages with type specification
const mockPages = [
  {
    mainTitle: 'Test Slide 1',
    subtitle: 'Bullet Points',
    type: 'bullet',
    textArray: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    ]
  },
  {
    mainTitle: 'Test Slide 2',
    subtitle: 'Paragraph',
    type: 'paragraph',
    textArray: [
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tortor massa, bibendum eu ultrices et, accumsan at nibh. Ut nec neque lacinia, placerat ipsum a, malesuada orci. Curabitur sit amet feugiat urna.`
    ]
  },
  {
    mainTitle: 'Test Slide 3',
    subtitle: 'Comparison',
    type: 'comparison',
    textArray: [
      'Laptop A features a sleek design and lightweight build, making it extremely portable. It comes equipped with an Intel Core i5 processor, 8GB of RAM, and a 256GB SSD, which provides a perfect balance between performance and battery life. Ideal for students and professionals on the go, it also includes a full HD display, ensuring vibrant visuals for any task.',
      'On the other hand, Laptop B is designed for power users who require advanced computing capabilities. With an Intel Core i7 processor, 16GB of RAM, and a 1TB HDD, it offers superior multitasking performance and ample storage for large files. Additionally, it features a dedicated graphics card, making it suitable for gaming and graphic design. However, its bulkier design makes it less portable than Laptop A.'
    ]
  },
    {
    mainTitle: 'Deep Learning',
    subtitle:"Neural Machine Translation: A New Approach",
    type:"paragraph",
    textArray:[
    "Neural machine translation (NMT) is an emerging approach to machine translation that aims to build a single neural network capable of translating sentences. This contrasts with traditional statistical machine translation (SMT), which relies on numerous smaller components tuned separately. NMT attempts to learn the entire translation process within a single neural network, potentially achieving more accurate and fluent translations. The core of NMT is the encoder-decoder architecture, where the encoder reads a source sentence and converts it into a fixed-length vector representation, and the decoder uses this representation to generate the translated sentence. This architecture allows the model to learn the complex relationships between words and sentences in a more unified and holistic manner, potentially leading to improved translation quality."
    ]
    },
    {
    mainTitle: 'Deep Learning',
    subtitle:"NMT vs SMT: A Comparison",
    text:"comparison",
    textArray:[
    "NMT strives to create a single neural network that learns the entire translation process, while SMT relies on multiple components tuned separately.",
    "NMT's unified approach allows for a more holistic understanding of language structure, potentially leading to more fluent and accurate translations, whereas SMT's modular approach may lead to less coherent results."
    ]
    },
    {
    mainTitle: 'Deep Learning',
    subtitle:"Key Takeaways about NMT",
    type:"bullet",
    textArray:[
    "Neural machine translation utilizes a single neural network to learn the translation process.",
    "NMT aims to build a more unified and holistic understanding of language structure compared to SMT.",
    "NMT's encoder-decoder architecture consists of an encoder that converts the source sentence into a vector representation and a decoder that generates the translated sentence.",
    "NMT has the potential to achieve more accurate and fluent translations due to its unified approach.",
    "NMT is still a relatively new field, but it has shown promising results and is an active area of research."
    ]
    },];

// Create the presentation
createSlide(theme, layoutlist, mockPages, "test");