const { createCanvas } = require('canvas'); // Canvas kütüphanesini yükle
const fs = require('fs').promises; // Asenkron dosya sistemi modülünü yükle
const path = require('path'); // Yol işlemleri için path modülünü yükle

async function createImage(title, backgroundColor , pdfname) {

    const outputFileName = path.parse(pdfname).name;
    const width = 800; // Genişlik
    const height = 400; // Yükseklik
    const canvas = createCanvas(width, height); // Canvas oluştur
    const ctx = canvas.getContext('2d'); // 2D bağlamını al

    // Arka plan rengi
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Metin ayarları
    ctx.fillStyle = "#000"; // Metin rengi
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const lines = []; // Satırları tutmak için bir dizi oluştur
    const words = (title || '').split(' '); // Başlık kelimelerine ayır
    let currentLine = ''; // Mevcut satırı tut

    // Kelimeleri kontrol et ve satırlara ayır
    for (let word of words) {
        const testLine = currentLine + word + ' '; // Yeni kelime ile dene
        const metrics = ctx.measureText(testLine); // Metin genişliğini ölç
        const lineHeight = 40; // Satır yüksekliği (metin boyutuyla aynı)

        // Eğer mevcut satır genişliği, canvas genişliğinden fazlaysa yeni satıra geç
        if (metrics.width > width && currentLine) {
            lines.push(currentLine); // Mevcut satırı kaydet
            currentLine = word + ' '; // Yeni satıra başla
        } else {
            currentLine = testLine; // Mevcut satıra kelimeyi ekle
        }
    }

    // Son satırı da ekle
    lines.push(currentLine);

    // Satırları çizerken ortala
    const totalHeight = lines.length * 40; // Toplam yükseklik
    let y = (height - totalHeight) / 2; // Y başlangıç noktası

    // Tüm satırları çiz
    for (let line of lines) {
        ctx.fillText(line.trim(), width / 2, y); // Her satırı ortala
        y += 40; // Y koordinatını bir satır yüksekliği kadar artır
    }

    // Resmi kaydet
     // Çıktı dosyası
    const outputDir = path.join("/static/", 'slaid_Image'); // Çıktı dizini
    const imagePath = path.join(outputDir, outputFileName+".png"); // Tam yol oluştur
    
    // Çıktı dizinini oluştur
    await fs.mkdir(outputDir, { recursive: true }); // Klasör yoksa oluştur

    const buffer = canvas.toBuffer('image/png'); // PNG formatında tampon oluştur
    await fs.writeFile(imagePath, buffer); // Asenkron olarak resmi dosyaya kaydet
    console.log('Resim oluşturuldu:', imagePath);
    return imagePath; // Dosya yolunu döndür
}

module.exports = createImage;
