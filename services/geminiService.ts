import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCreativeDescription = async (context: string): Promise<string> => {
  const client = getClient();
  
  // Fallback if no API key is present (for UI demo purposes)
  if (!client) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("API Key missing. Please provide an API_KEY to generate a real poetic description. In the meantime, imagine a beautiful description of " + context + ".");
      }, 1000);
    });
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, evocative, and artistic paragraph (about 3 sentences) describing the feeling of: ${context}. The tone should be gallery-esque and sophisticated.`,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Error generating content:", error);
    return "The muse is silent at the moment. Please try again later.";
  }
};