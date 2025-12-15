import { GoogleGenAI } from "@google/genai";
import { FormatType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a highly precise, deterministic file conversion engine. 
Your goal is to convert input data from one format to another strictly.
Do not add conversational filler, explanations, or markdown code blocks (unless the target format IS markdown).
Return ONLY the raw converted content.
If the input is malformed but repairable, repair it and convert.
If the input is completely unrecognizable or incompatible with the target format, return "ERROR: [Reason]".
`;

export const convertContent = async (
  content: string,
  fromFormat: FormatType,
  toFormat: FormatType
): Promise<string> => {
  if (!content.trim()) return '';

  try {
    const prompt = `
    Source Format: ${fromFormat}
    Target Format: ${toFormat}
    
    Input Content:
    ${content}
    
    Convert the input content to the target format.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Low temperature for deterministic output
        maxOutputTokens: 8192,
      },
    });

    let text = response.text || '';

    // Cleanup: Remove markdown code block fences if Gemini adds them despite instructions
    // (Common behavior for code outputs)
    if (text.startsWith('```')) {
      const lines = text.split('\n');
      // Remove first line (```format)
      lines.shift();
      // Remove last line if it is just ```
      if (lines[lines.length - 1].trim() === '```') {
        lines.pop();
      }
      text = lines.join('\n');
    }

    return text.trim();
  } catch (error) {
    console.error("Conversion error:", error);
    throw new Error("Failed to convert content. Please check your API key or input size.");
  }
};