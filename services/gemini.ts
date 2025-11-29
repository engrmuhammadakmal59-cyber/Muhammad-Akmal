import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A clear, concise explanation of the electrical concept for a student." },
    formula_latex: { type: Type.STRING, description: "The primary formula in clean LaTeX format without surrounding text (e.g. V = I \\cdot R)." },
    real_world_analogy: { type: Type.STRING, description: "A creative real-world analogy to help understand the abstract concept." },
    practical_application: { type: Type.STRING, description: "A common real-world application of this concept." },
    fun_fact: { type: Type.STRING, description: "An interesting historical or scientific fact about this concept." },
    related_concepts: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "A list of 3-4 related electrical engineering topic names that a student should learn next."
    },
    youtube_queries: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Specific YouTube search query or video title." },
          language: { type: Type.STRING, enum: ["English", "Hindi"], description: "The language of the video." }
        }
      },
      description: "4 recommended YouTube search queries: 2 in English and 2 in Hindi, focused on tutorials for this topic."
    }
  },
  required: ["summary", "formula_latex", "real_world_analogy", "practical_application", "fun_fact", "related_concepts", "youtube_queries"]
};

export const fetchConceptDetails = async (topicName: string): Promise<GeminiResponse | null> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Explain the electrical engineering concept "${topicName}". 
    Provide a clear summary, the main formula, a good analogy, a practical application, and a fun fact.
    Ensure the formula is standard LaTeX for display.
    Also provide 3 related concept names, and 4 specific YouTube search queries (2 in English, 2 in Hindi) to find good tutorials.`;

    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3,
      }
    });

    const text = result.text;
    if (!text) return null;
    
    return JSON.parse(text) as GeminiResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};