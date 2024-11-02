const fs = require('fs').promises; // Asenkron dosya sistemi
const pdf = require('pdf-parse');

// PDF dosyasının yolunu belirtin
const pdfPath = '1.pdf';

async function extractTextFromPDF() {
    try {
        // PDF dosyasını asenkron olarak oku
        const dataBuffer = await fs.readFile(pdfPath);
        
        // PDF içeriğini çıkart
        const data = await pdf(dataBuffer);
        
        // Çıkarılan metni konsola yazdır
        console.log(data.text);
        
        // Metni bir dosyaya yazmak için (isteğe bağlı)
        await fs.writeFile('./output.txt', data.text);
    } catch (error) {
        console.error("Hata:", error);
    }
}

// Fonksiyonu çağır
extractTextFromPDF();