const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const { GoogleAIFileManager } = require("@google/generative-ai/server");

require("dotenv").config();
  
  // Initialize Google AI with your API key
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);
  
  // Define the generation configuration with your schema
  const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      properties: {
        section: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string"
              },
              subtitles: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    nameOfSubtitle: {
                      type: "string"
                    },
                    descriptionofSubtitle: {
                      type: "string"
                    }
                  },
                  required: [
                    "nameOfSubtitle",
                    "descriptionofSubtitle"
                  ]
                }
              }
            },
            required: [
              "title",
              "subtitles"
            ]
          }
        }
      },
      required: [
        "section"
      ]
    }
  };
  
  // Function to upload a file to Gemini
  async function uploadFile(path, mimeType) {
    try {
      const uploadResult = await fileManager.uploadFile(path, {
        mimeType,
        displayName: path,
      });
      console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.name}`);
      return uploadResult.file;
    } catch (error) {
      console.error(`Error uploading file ${path}:`, error);
      throw error;
    }
  }
  
  // Function to wait for files to be processed
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
  
  // Main function to process PDFs
  async function processPDFs(pdfPaths) {
    try {
      // Initialize the model
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        generationConfig
      });
  
      // Upload all PDFs
      console.log("Uploading PDF files...");
      const uploadedFiles = await Promise.all(
        pdfPaths.map(path => uploadFile(path, "application/pdf"))
      );
  
      // Wait for files to be processed
      await waitForFiles(uploadedFiles);
  
      // Create the prompt for analysis
      const prompt = `Given a set of PDF documents, divide the content into sections based on major topics or themes. 
      For each section, create a title that reflects the main idea of that section. 
      Then, for each section, generate a list of subtitles where each subtitle represents a subtopic. 
      Each subtitle should include a short, descriptive title (nameOfSubtitle) and a concise description 
      (descriptionOfSubtitle) that explains the subtitle's content. 
      Aim for clarity and coherence in structuring these titles and descriptions to facilitate easy understanding of the material.`;
  
      // Start chat session
      const chat = model.startChat();
      
      // Send files and prompt
      const result = await chat.sendMessage([
        ...uploadedFiles.map(file => ({
          fileData: {
            mimeType: file.mimeType,
            fileUri: file.uri,
          },
        })),
        { text: prompt }
      ]);
  
      // Parse and return the response
      const response = JSON.parse(result.response.text());
      return response;
  
    } catch (error) {
      console.error("Error processing PDFs:", error);
      throw error;
    }
  }
  
  // Example usage
  async function main(pdfPathList) {

  
    try {
      const result = await processPDFs(pdfPathList);
      console.log("Processing complete. Results:");
      return result;
    } catch (error) {
      console.error("Failed to process PDFs:", error);
    }
  }
  
  // Run the program
module.exports = main;