
import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiAnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = "gemini-2.5-flash";

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        isDog: { 
            type: Type.BOOLEAN, 
            description: "Is there a dog in the photo? Must be true or false." 
        },
        breeds: {
            type: Type.ARRAY,
            description: "A list of identified dog breeds and their confidence scores. Always provide at least one breed if a dog is present, even if confidence is low.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { 
                        type: Type.STRING, 
                        description: "Name of the dog breed. E.g., 'Labrador Retriever' or 'Mixed Breed'." 
                    },
                    percentage: { 
                        type: Type.NUMBER, 
                        description: "Confidence score from 0 to 100." 
                    }
                },
                required: ["name", "percentage"]
            }
        },
        interestingFact: {
            type: Type.STRING,
            description: "A fun or interesting fact about the primary identified breed. If no dog is detected, provide an empty string."
        }
    },
    required: ["isDog", "breeds", "interestingFact"]
};

export const identifyBreedFromImage = async (base64Image: string): Promise<GeminiAnalysisResult> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
        },
    };

    const textPart = {
        text: `Analyze the provided image to identify the dog's breed.
        1. Determine if a dog is present in the image.
        2. If a dog is present, identify its breed(s) and confidence scores. For mixed breeds, list the top components.
        3. Provide one interesting or fun fact about the most prominent breed identified.
        4. Respond strictly in the provided JSON format. If no dog is found, set 'isDog' to false and provide empty information.`
    };
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            }
        });

        const jsonString = response.text.trim();
        const parsedResult = JSON.parse(jsonString) as GeminiAnalysisResult;

        if (parsedResult.breeds) {
            parsedResult.breeds.sort((a, b) => b.percentage - a.percentage);
        }

        return parsedResult;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("The AI model failed to process the request.");
    }
};
