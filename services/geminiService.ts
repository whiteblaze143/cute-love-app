import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLovePoem = async (partnerName: string, instructions: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, cute, rhyming love poem for ${partnerName}. 
      Include these specific details and themes: "${instructions}". 
      
      Tone: Romantic, successful, and slightly playful (Corporate Baddie vibe).
      
      Keep it under 100 words.
      Format it with simple line breaks.`,
    });
    
    return response.text || "Roses are red, deals are signed true, from 16 to now, I still choose you!";
  } catch (error) {
    console.error("Error generating poem:", error);
    return "Roses are red, violets are blue, the AI is tired, but I still love you! ❤️";
  }
};