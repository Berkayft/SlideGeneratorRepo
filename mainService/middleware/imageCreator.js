const { createCanvas } = require('canvas');
const fs = require('fs').promises;
const path = require('path');

async function createImage(title, backgroundColor, pdfname) {
    const outputFileName = path.parse(pdfname).name;
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Text settings
    ctx.fillStyle = "#000";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const lines = [];
    const words = (title || '').split(' ');
    let currentLine = '';

    for (let word of words) {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > width && currentLine) {
            lines.push(currentLine);
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);

    const totalHeight = lines.length * 40;
    let y = (height - totalHeight) / 2;
    for (let line of lines) {
        ctx.fillText(line.trim(), width / 2, y);
        y += 40;
    }

    const outputDir = path.resolve(__dirname, "../slaytImages"); // Using __dirname for absolute path
    const imagePath = path.join(outputDir, outputFileName + ".png");
    
    try {
        await fs.mkdir(outputDir, { recursive: true });
        const buffer = canvas.toBuffer('image/png');
        await fs.writeFile(imagePath, buffer);
        console.log('Resim oluşturuldu:', imagePath);
    } catch (error) {
        console.error('Error creating image:', error);
    }

    return imagePath;
}

module.exports = createImage;
