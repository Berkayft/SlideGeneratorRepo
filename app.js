const express = require("express");
require("dotenv").config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.get("/", (req, res) => {
    res.send("kral ensar hoşgeldin de selamla");
});

app.get('/generate-text', async (req, res) => {
    const prompt = req.query.prompt || "kral ensar hoşgeldin de selamla";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ generatedText: text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server running on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
});