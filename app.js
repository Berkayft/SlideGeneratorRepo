const express = require("express");
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables with explicit path
const envResult = dotenv.config({ path: path.join(__dirname, '.env') });

if (envResult.error) {
    console.log("Error loading .env file:", envResult.error);
    process.exit(1);
}

// Validate environment variables
if (!process.env.GOOGLE_API_KEY) {
    console.error("GOOGLE_API_KEY is not set in environment variables");
    process.exit(1);
}

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Google AI with validation
let genAI;
try {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    console.log("Google AI initialized successfully");
} catch (error) {
    console.error("Error initializing Google AI:", error);
    process.exit(1);
}

// Configure view engine with normalized paths
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'templates').replace(/\\/g, '/'));
app.set('view engine', 'html');

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

app.get('/', (req, res) => {
    try {
        res.render('base.html');
    } catch (error) {
        console.error("Error rendering base template:", error);
        res.status(500).send("Error rendering page");
    }
});

app.get('/generate-text', async (req, res) => {
    const prompt = req.query.prompt || "kral ensar hoşgeldin de selamla";

    try {
        console.log("Attempting to generate content with prompt:", prompt);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("Content generated successfully");
        res.json({ generatedText: text });
    } catch (error) {
        console.error("Error in content generation:", error);
        res.status(500).json({ 
            message: 'An error occurred during content generation', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Add startup validation
const startServer = async () => {
    try {
        // Test Google AI connection
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        await model.generateContent("test");
        console.log("Google AI connection test successful");

        app.listen(PORT, (error) => {
            if (!error) {
                console.log("Server running on port " + PORT);
                console.log("Environment:", process.env.NODE_ENV || 'development');
                console.log("API Key status:", process.env.GOOGLE_API_KEY ? "Present" : "Missing");
            } else {
                console.log("Error occurred, server can't start", error);
            }
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();