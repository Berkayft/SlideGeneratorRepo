const { GoogleGenerativeAI , SchemaType  } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
require("dotenv").config();

const initializeGoogleAI = (apiKey) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const fileManager = new GoogleAIFileManager(apiKey);
    return { genAI, fileManager };
  };
  
  // PDF dosyasını yükleme
const uploadPDFFile = async (fileManager, filePath) => {
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: "application/pdf",
      displayName: "Uploaded PDF",
    });
  
    console.log(
      `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
    );
  
  
    return uploadResponse.file;
  };


// LongText Schema
const LongTextSchema = {
    description: "A long text which created for teaching purpose",
    type: SchemaType.STRING,
    
}