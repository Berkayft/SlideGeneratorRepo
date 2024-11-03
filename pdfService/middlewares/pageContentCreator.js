const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);

const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
        type: "object",
        properties: {
            pageContents: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        TextType: {
                            type: "string",
                            enum: [
                                "Listed text",
                                "Paragraphs",
                                "Comparision"
                            ]
                        },
                        Texts: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                        HeadingOfPage: {
                            type: "string"
                        }
                    },
                    required: [
                        "TextType",
                        "Texts",
                        "HeadingOfPage"
                    ]
                }
            }
        },
        required: [
            "pageContents"
        ]
    }
};

async function uploadFile(path, mimeType) {
    try {
        const uploadResult = await fileManager.uploadFile(path, {
            mimeType,
            displayName: path,
        });
        console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.name}`);
        return uploadResult.file;
    } catch (error) {
        console.error(`Error uploading file ${path}:, error`);
        throw error;
    }
}

async function waitForFiles(files) {
    console.log("Waiting for files to be processed...");
    for (const file of files) {
        let currentFile = await fileManager.getFile(file.name);
        while (currentFile.state === "PROCESSING") {
            process.stdout.write(".");
            await new Promise(resolve => setTimeout(resolve, 5000));
            currentFile = await fileManager.getFile(file.name);
        }
        if (currentFile.state !== "ACTIVE") {
            throw new Error(`File ${file.name} failed to process`);
        }
    }
    console.log("\nAll files are ready for processing");
}

function sanitizeJSONString(str) {
    try {
        // Replace any unescaped quotes within strings
        str = str.replace(/(?<!\\)"/g, '\\"');
        // Ensure the string is properly wrapped in quotes
        if (!str.startsWith('"')) str = '"' + str;
        if (!str.endsWith('"')) str = str + '"';
        return str;
    } catch (error) {
        console.error("Error sanitizing JSON string:", error);
        return str;
    }
}

function parseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Invalid JSON received:", jsonString);
        console.error("JSON parsing error:", error);
        
        // Attempt to fix common JSON issues
        try {
            // Replace any unescaped newlines
            const cleanedString = jsonString
                .replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/\t/g, "\\t");
            
            return JSON.parse(cleanedString);
        } catch (secondError) {
            // If we still can't parse it, return a default structure
            return {
                pageContents: [{
                    TextType: "Paragraphs",
                    Texts: ["Error processing content. Please try again."],
                    HeadingOfPage: "Error Processing Content"
                }]
            };
        }
    }
}

async function processPDFs(pdfPaths, sections) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig
        });

        console.log("Uploading PDF files...");
        const uploadedFiles = await Promise.all(
            pdfPaths.map(path => uploadFile(path, "application/pdf"))
        );

        await waitForFiles(uploadedFiles);

        const results = [];

        for (const section of sections) {
            const { title, subtitles } = section;

            for (const subtitle of subtitles) {
                const prompt = `Analyze the provided PDFs related to the title '${title}' and subtitle '${subtitle.nameOfSubtitle}' with the description: '${subtitle.descriptionofSubtitle}'. For this subtitle, create content that best summarizes key information, structured in one of three formats: Paragraphs, Comparison, or Bulleted List.
                
                Paragraphs: Write a single paragraph no more than 200 words that conveys the main ideas.
                Comparison: Provide two brief texts of up to 4 lines each, highlighting distinct comparisons between concepts or elements.
                Bulleted List: Provide a list of 5 points, each limited to 40 words, summarizing the essential details or takeaways.
                Choose the format that best organizes the information for clarity on a single slide. Assign a heading to this slide that captures the main idea in one concise phrase.
                
                IMPORTANT: Ensure your response is in valid JSON format matching the specified schema.`;

                const chat = model.startChat();
                
                const result = await chat.sendMessage([
                    ...uploadedFiles.map(file => ({
                        fileData: {
                            mimeType: file.mimeType,
                            fileUri: file.uri,
                        },
                    })),
                    { text: prompt }
                ]);

                // Parse the response carefully
                const responseText = result.response.text();
                const parsedResponse = parseJSON(responseText);
                results.push(parsedResponse);
            }
        }

        return results;

    } catch (error) {
        console.error("Error processing PDFs:", error);
        throw error;
    }
}

async function main(pdfPathList, inputData) {
    try {
        const sections = inputData.section;
        const result = await processPDFs(pdfPathList, sections);
        console.log("Processing complete. Results:");
        return result;
    } catch (error) {
        console.error("Failed to process PDFs:", error);
        // Return a default response structure instead of throwing
        return [{
            pageContents: [{
                TextType: "Paragraphs",
                Texts: ["An error occurred while processing the PDFs. Please try again."],
                HeadingOfPage: "Processing Error"
            }]
        }];
    }
}

module.exports = main;