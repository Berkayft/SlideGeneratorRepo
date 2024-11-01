const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
require("dotenv").config();

// Google AI istemcilerini başlatma
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

const titlesSchema = {
  description: "List of titles and subtitles.",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      name: {
        type: SchemaType.STRING,
        description: "Name of the title or subtitle",
        nullable: false,
      },
      type: {
        type: SchemaType.STRING,
        description: "Type of the item, e.g., 'title' or 'subtitle'",
        nullable: false,
      },
    },
    required: ["name", "type"],
  },
};

const slideDeckSchema = {
    description: "Schema for a slide deck containing exactly 4 pages",
    type: SchemaType.ARRAY,
    minItems: 1,
    maxItems: 5,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            mainTitle: {
                type: SchemaType.STRING,
                description: "Main title of the slide page",
                nullable: false
            },
            subtitle: {
                type: SchemaType.STRING,
                description: "Subtitle of the slide page (if any)",
                nullable: true
            },
            textArray: {
                type: SchemaType.ARRAY,
                description: "Array of brief texts for the slide page, each entry should be concise",
                items: {
                    type: SchemaType.STRING,
                },
                maxItems: 5,
                nullable: true
            },
        },
        required: ["mainTitle", "textArray"]
    }
};

// imageArray: {
//     type: SchemaType.ARRAY,
//     description: "Array of images for the slide page, with a maximum of 3-4 images",
//     items: {
//         type: SchemaType.STRING,
//     },
//     maxItems: 4,
//     nullable: true
// } schemaya sonra eklenebilir

const generateTitles = async (model, file) => {
  const result = await model.generateContent([
    {
      fileData: {
        mimeType: file.mimeType,
        fileUri: file.uri,
      },
    },
    {
        text: `Analyze the PDF and extract titles and subtitles for slides. 
            Only the main sections (like Abstract, Introduction, Conclusion) 
            should be classified as "title", and all other sections as "subtitle". 
            Do not use the document's main title as a "title" in this list.`,
    },
  ]);

  return result;
};

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const generatePages = async (genAI, file, titlesjson) => {
    const length = titlesjson.length;
    const floor = Math.floor(length / 5);
    const remainder = length % 5;

    const pages = [];
    
    for (let i = 0; i < floor; i++) {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: slideDeckSchema,
                temperature: 0.7,
            },
        });

        let givenTitles = titlesjson[i * 5].name + ", " + titlesjson[i * 5 + 1].name + ", " + titlesjson[i * 5 + 2].name + ", " + titlesjson[i * 5 + 3].name + ", " + titlesjson[i * 5 + 4].name;
        
        let pagePrompt = `Analyze the PDF and summarize the key information relevant to the titles: ${givenTitles}. Provide concise, educational texts for the slide. Ensure that the information is clear and suitable for teaching purposes.`;
        
        try {
            const result = await model.generateContent([
                {
                    fileData: {
                        mimeType: file.mimeType,
                        fileUri: file.uri,
                    },
                },
                {
                    text: pagePrompt,
                },
            ]);
            let jsonObject = JSON.parse(result.response.text());
            pages.push(...jsonObject);
        } catch (error) {
            console.error("Error generating content:", error);
            // Hatanın yönetimi
        }
        await sleep(2000);
    }

    if (remainder > 0) {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: slideDeckSchema,
                temperature: 0.7,
            },
        });

        let lastTitles = titlesjson.slice(floor * 5).map(item => item.name).join(", ");
        
        let pagePrompt = `Analyze the PDF and summarize the key information relevant to the titles: ${lastTitles}. Provide concise, educational texts for the slide. Ensure that the information is clear and suitable for teaching purposes.`;

        try {
            const result = await model.generateContent([
                {
                    fileData: {
                        mimeType: file.mimeType,
                        fileUri: file.uri,
                    },
                },
                {
                    text: pagePrompt,
                },
            ]);
            let jsonObject = JSON.parse(result.response.text());
            pages.push(...jsonObject);
        } catch (error) {
            console.error("Error generating content:", error);
            // Hatanın yönetimi
        }
    }

    return pages;
};

const processPdf = async (pdfPath) => {
    const pdfFile = pdfPath;
    const { genAI, fileManager } = initializeGoogleAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: titlesSchema,
        },
    });

    const uploadedFile = await uploadPDFFile(fileManager, pdfFile);
    const result = await generateTitles(model, uploadedFile);
    
    console.log(result.response.text());

    const jsonContent = JSON.parse(result.response.text()); 



    // await ekle
    const result2 = await generatePages(genAI ,uploadedFile, jsonContent);
    console.log(result2);
    console.log(jsonContent.length);
    return result2;
};


module.exports = processPdf;

