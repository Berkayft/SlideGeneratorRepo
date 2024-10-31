require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');


const pdfSend = async (filepath) => {
    try{
        const form = new FormData();

        form.append("file",fs.createReadStream(filepath));

        const response = await axios.post(process.env.PDFSERVERURL, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${process.env.PDFPROCESSKEY}`
            }
        });
    }
    catch (error){
        console.error(error);
    }
}
    

module.exports = pdfSend;