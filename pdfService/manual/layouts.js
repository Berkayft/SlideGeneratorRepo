const Layout = require("../utils/layout");
const ContentArea = require("../utils/contentArea");

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

module.exports = layoutlist;

