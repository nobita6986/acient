
import { GoogleGenAI, Modality } from "@google/genai";

export async function generateImage(
  apiKey: string,
  characterImages: string[], // base64 strings
  prompt: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  
  const imageParts = characterImages.map(base64Data => ({
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg', // Assuming jpeg, adjust if needed
      }
  }));

  const textPart = {
      text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [...imageParts, textPart],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:image/png;base64,${base64ImageBytes}`;
      }
    }

    throw new Error("No image data found in the API response.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate image. Please check your API key and prompt.");
  }
}
