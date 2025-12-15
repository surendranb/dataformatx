import { GoogleGenAI } from "@google/genai";
import { FormatType, LLMConfig } from '../types';

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
  toFormat: FormatType,
  config: LLMConfig
): Promise<string> => {
  if (!content.trim()) return '';
  if (!config.apiKey && config.provider === 'gemini') {
    throw new Error("API Key is missing. Please check Settings.");
  }

  const prompt = `
  Source Format: ${fromFormat}
  Target Format: ${toFormat}
  
  Input Content:
  ${content}
  
  Convert the input content to the target format.
  `;

  try {
    let text = '';

    if (config.provider === 'gemini') {
      // GEMINI IMPLEMENTATION
      const ai = new GoogleGenAI({ apiKey: config.apiKey });
      const response = await ai.models.generateContent({
        model: config.model || 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.1,
          maxOutputTokens: 8192,
        },
      });
      text = response.text || '';

    } else {
      // OPENAI COMPATIBLE IMPLEMENTATION (Ollama, LocalAI, OpenRouter, LM Studio)
      let baseUrl = config.baseUrl.trim();
      
      // Default to OpenAI if empty
      if (!baseUrl) {
        baseUrl = 'https://api.openai.com/v1';
      }

      // Remove trailing slash if present
      baseUrl = baseUrl.replace(/\/$/, '');

      // Intelligent Local LLM URL fix
      // If user enters "http://localhost:1234" (common for LM Studio), we need to append "/v1"
      // We check if it is a local address and is missing the version path
      if (
        (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1') || baseUrl.includes('192.168.') || baseUrl.includes(':1234') || baseUrl.includes(':11434')) &&
        !baseUrl.endsWith('/v1')
      ) {
         baseUrl = `${baseUrl}/v1`;
      }

      const url = `${baseUrl}/chat/completions`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 8192, // OpenAI standard param
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      text = data.choices?.[0]?.message?.content || '';
    }

    // Cleanup: Remove markdown code block fences if present
    if (text.startsWith('```')) {
      const lines = text.split('\n');
      lines.shift(); // Remove first line (```format)
      if (lines[lines.length - 1].trim() === '```') {
        lines.pop();
      }
      text = lines.join('\n');
    }

    return text.trim();

  } catch (error: any) {
    console.error("Conversion error:", error);
    throw new Error(error.message || "Failed to convert content. Please check your settings.");
  }
};