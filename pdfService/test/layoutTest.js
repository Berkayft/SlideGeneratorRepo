const Layout = require("../utils/layout");
const ContentArea = require("../utils/contentArea");
const createSlide = require("../middlewares/pptxGenerator");
const themelist = require("../manual/themes");
const theme = themelist[0];


  
  const fiveLineLayout = new Layout("5 line", [
    new ContentArea("text", 0.5, 1.5, 9.3, 0.7),  // 1. Satır
    new ContentArea("text", 0.5, 2.2, 9.3, 0.7),                               // 2. Satır
    new ContentArea("text", 0.5, 2.9, 9.3, 0.7),                               // 3. Satır
    new ContentArea("text", 0.5, 3.6, 9.3, 0.7),                               // 4. Satır
    new ContentArea("text", 0.5, 4.3, 9.3, 0.7),                               // 5. Satır
]);

const fourLineLayout = new Layout("4 line", [
  new ContentArea("text", 0.5, 1.5, 9.3, 0.7),  // 1. Satır
  new ContentArea("text", 0.5, 2.2, 9.3, 0.7),                               // 2. Satır
  new ContentArea("text", 0.5, 2.9, 9.3, 0.7),                               // 3. Satır
  new ContentArea("text", 0.5, 3.6, 9.3, 0.7)                               // 4. Satır
]);

const threeLineLayout = new Layout("3 line", [
  new ContentArea("text", 0.5, 1.5, 9.3, 0.7),  // 1. Satır
  new ContentArea("text", 0.5, 2.2, 9.3, 0.7),                               // 2. Satır
  new ContentArea("text", 0.5, 2.9, 9.3, 0.7),                               // 3. Satır                               // 3. Satır
]);

const twoLineLayout = new Layout("2 line", [
  new ContentArea("text", 0.5, 1.5, 9.3, 0.7),  // 1. Satır
  new ContentArea("text", 0.5, 2.2, 9.3, 0.7),  // 2. Satır                                 // 2. Satır
]);

const oneLineLayout = new Layout("1 line", [
  new ContentArea("text", 0.5, 1.5, 9.3, 4),  // 1. Satır                               // 2. Satır
]);

  
const layoutlist = [fiveLineLayout,fourLineLayout,threeLineLayout,twoLineLayout,oneLineLayout];


const mockPages = [
    {
      mainTitle: 'Test Slide 1',
      textArray: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque urna magna, consequat in velit id.','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tristique risus odio, a venenatis quam elementum et. Nulla facilisi. Quisque feugiat tortor ipsum, eget vestibulum lectus faucibus at. Suspendisse sed.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque urna magna, consequat in velit id.','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis nisl at lorem scelerisque pharetra. Mauris ligula ligula, rhoncus sit amet lacus.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque urna magna, consequat in velit id.']
    },
    {
      mainTitle: 'Test Slide 2',
      textArray: [`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tortor massa, bibendum eu ultrices et, accumsan at nibh. Ut nec neque lacinia, placerat ipsum a, malesuada orci. Curabitur sit amet feugiat urna. Phasellus facilisis mollis orci, a porttitor purus congue ac. Nulla ut mi nec felis tempor elementum. Fusce sagittis mattis fringilla. Suspendisse tempus, lectus eu efficitur congue, libero diam luctus quam, ut convallis elit ex nec turpis. Pellentesque eget.`,]
    },
    {
      mainTitle: 'Test Slide 3',
      textArray: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque urna magna, consequat in velit id.',
         'Line 2', 
         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque urna magna, consequat in velit id.',
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque urna magna, consequat in velit id. Pellentesque urna magna, consequat in velit id."
        ]
    }
  ];



createSlide(theme,layoutlist,mockPages,"test");



