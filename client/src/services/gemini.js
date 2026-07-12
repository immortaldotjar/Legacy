import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

function cleanJson(text) {
    if (!text) return "";

    text = text.replace(/```json/gi, "");
    text = text.replace(/```/g, "");

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
        throw new Error("No valid JSON found in Gemini response.");
    }

    return text.slice(start, end + 1).trim();
}

export async function generateLegacy(answers) {
    const prompt = `
You are an award-winning documentary filmmaker.

A person has answered six interview questions.

Create a beautiful, emotional documentary.

Return ONLY valid JSON.

The JSON must follow this schema exactly:

{
  "title": "",
  "tagline": "",
  "openingQuote": "",

  "character": {
    "appearance": "",
    "personality": ""
  },

  "chapters": [
    {
      "title": "",
      "content": ""
    }
  ],

  "ending": ""
}

Interview:

Passion:
${answers.passion}

Beginning:
${answers.beginning}

Challenge:
${answers.challenge}

Motivation:
${answers.motivation}

Achievement:
${answers.achievement}

Future:
${answers.future}
`;

    try {
        console.log("Sending prompt to Gemini...");

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
        });

        console.log("Full Gemini Response:", response);

        const rawText = response.text;

        console.log("Raw Response:", rawText);

        if (!rawText) {
            throw new Error("Gemini returned an empty response.");
        }

        const cleaned = cleanJson(rawText);

        console.log("Cleaned JSON:", cleaned);

        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Gemini Error:", error);

        throw error;
    }
}