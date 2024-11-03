require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Function to send a single PDF
const pdfSend = async (filepath) => {
    try {
        const form = new FormData();
        console.log("uploads/pdf/" + filepath);
        form.append("file", fs.createReadStream("uploads/pdf/" + filepath));

        const response = await axios.post(process.env.PDFSERVERURL+"/upload-pdf", form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${process.env.PDFPROCESSKEY}`
            },
            timeout: 180000
        });

        return response.data; // Return response data if needed
    } catch (error) {
        console.error(error);
        throw error; // Throw error to handle it later if needed
    }
}

// Function to send multiple PDFs using pdfSend
const sendMultiplePDF = async (pdfPaths) => {
    const responses = [];
    for (const filepath of pdfPaths) {
        try {
            const response = await pdfSend(filepath);
            responses.push(response); // Collect the responses
        } catch (error) {
            console.error(`Error sending ${filepath}:`, error);
        }
    }
    return responses; // Return an array of responses
}

// Function to send all PDFs in a single request
const startProcess = async (pdfPaths) => {
    try {
        // FormData yerine doğrudan JSON gönder
        const response = await axios.post(process.env.PDFSERVERURL + "/startProcess", 
            { texts: pdfPaths }, // Doğrudan array olarak gönder
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.PDFPROCESSKEY}`
                },
                timeout: 1440000
            }
        );

        console.log('Response from server:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error uploading file paths:', error);
        throw error;
    }
};


// Exporting the functions for use in other modules
module.exports = { pdfSend, sendMultiplePDF, startProcess };
