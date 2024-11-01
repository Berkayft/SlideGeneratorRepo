require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');


const pptxSend = async (filepath) => {
    try{
        const form = new FormData();

        form.append("file",fs.createReadStream(filepath));

        const response = await axios.post(process.env.MAINSERVERURL, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${process.env.MAINPROCESSKEY}`
            },
            timeout: 180000
        });
    }
    catch (error){
        console.error(error);
    }
}
    

module.exports = pptxSend;