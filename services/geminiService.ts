import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Initialize only if key exists to avoid runtime crashes, though we handle errors gracefully
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateDailyInsight = async (): Promise<string> => {
  if (!ai) {
    return "Lembre-se: Sua saúde mental é sua prioridade. (Adicione uma API KEY para receber insights personalizados)";
  }

  try {
    const model = 'gemini-1.5-flash';
    const prompt = "Gere uma frase curta, acolhedora e inspiradora sobre saúde mental e autocuidado para pacientes de psiquiatria. Maximo 20 palavras. Em Português.";

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Cuide da sua mente com carinho hoje.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Cada passo conta na sua jornada de bem-estar.";
  }
};

export const generateNewsletterPreview = async (): Promise<string> => {
    if (!ai) {
        return "Inscreva-se para receber conteúdos exclusivos sobre ansiedade, TDAH e bem-estar.";
    }

    try {
        const model = 'gemini-1.5-flash';
        const prompt = "Crie um título curto e chamativo para uma newsletter semanal de psiquiatria focado em curiosidades sobre o cérebro ou dicas de bem-estar. Apenas o título.";
        
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text || "Conteúdos exclusivos semanais.";
    } catch (error) {
        return "Conteúdos exclusivos semanais sobre saúde mental.";
    }
}