
import { GoogleGenAI } from "@google/genai";
import { TableRow } from '../types';

export const analyzeDataWithGemini = async (
  data: TableRow[],
  headers: string[],
  userPrompt: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Create a concise summary of the data to send to the model
  const dataSample = data.slice(0, 10).map(row => 
    headers.map(header => row[header]).join(', ')
  ).join('\n');

  const fullPrompt = `
    Anda adalah seorang analis data ahli. Diberikan data berikut dalam format CSV, jawab pertanyaan pengguna.
    Fokuslah untuk memberikan wawasan yang jelas, ringkas, dan dapat ditindaklanjuti.

    **Header Kolom:**
    ${headers.join(', ')}

    **Contoh Data (hingga 10 baris pertama):**
    ${dataSample}

    **Total Baris Data:** ${data.length}

    **Pertanyaan Pengguna:**
    "${userPrompt}"

    **Analisis Anda:**
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Terjadi kesalahan saat menghubungi AI: ${error.message}`;
    }
    return "Terjadi kesalahan yang tidak diketahui saat menghubungi AI.";
  }
};
