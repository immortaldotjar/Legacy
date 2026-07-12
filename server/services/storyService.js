import { GoogleGenAI } from "@google/genai";
import { generateStoryImages } from "./imageService.js";
import { findMissingFields } from "./validateAnswers.js";
import { SESSION_COOKIE_NAME, SESSION_TTL_MS, createSessionCookieValue, isSessionValid } from "./session.js";

function buildFallbackStory(answers) {
    const chapters = [
        {
            title: "The Spark",
            content: `In the beginning, ${answers?.passion || "a quiet passion"} became the force that shaped every step forward. It was not a grand declaration, but a steady flame that kept calling the heart back to purpose.`,
            mood: "Hopeful",
        },
        {
            title: "The Beginning",
            content: `The journey started when ${answers?.beginning || "the first brave step"} opened a path that felt uncertain but deeply meaningful. Every memory carried the feeling that something important was beginning to unfold.`,
            mood: "Reflective",
        },
        {
            title: "The Storm",
            content: `Challenges arrived in the form of ${answers?.challenge || "difficult moments"}, testing patience, confidence, and belief. Yet each obstacle became a teacher, shaping resilience instead of breaking spirit.`,
            mood: "Tense",
        },
        {
            title: "The Fire",
            content: `What kept the journey alive was ${answers?.motivation || "a personal reason that never faded"}. Even in uncertainty, that deeper purpose gave the next step enough strength to arrive.`,
            mood: "Determined",
        },
        {
            title: "The Victory",
            content: `The achievement of ${answers?.achievement || "a meaningful milestone"} became a quiet celebration of perseverance. It was proof that persistence had turned effort into something lasting.`,
            mood: "Triumphant",
        },
        {
            title: "The Future",
            content: `Looking ahead, ${answers?.future || "the future feels full of possibility"}. The path ahead is still unfolding, but it now carries the confidence of someone who has already learned how to keep going.`,
            mood: "Inspirational",
        },
    ];

    return {
        title: answers?.name ? `${answers.name}: A Legacy in the Making` : "A Legacy in the Making",
        tagline: "A story shaped by courage, memory, and purpose.",
        openingQuote:
            "The most meaningful journeys are rarely planned; they are lived with heart.",
        chapters,
        ending:
            "What began as a single spark became a life defined by growth, resilience, and the courage to continue.",
    };
}

async function generateWithGemini(answers) {

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY");
    }

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are an award-winning documentary writer.

Transform the interview below into a cinematic documentary.

Interview:

${JSON.stringify(answers, null, 2)}

Return ONLY valid JSON.

{
  "title":"",
  "tagline":"",
  "openingQuote":"",
  "chapters":[
    {
      "title":"",
      "content":"",
      "mood":""
    }
  ],
  "ending":""
}

Rules:

- The subject's name is "${answers?.name || "the storyteller"}". Use it naturally in the title and, where it fits, in the narration.
- Exactly 6 chapters
- Each chapter should contain 120-180 words
- Every chapter title must be unique
- Make it emotional and cinematic
- Write like a Netflix documentary
- Use vivid storytelling
- No markdown
- No explanations
- JSON only
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
    });

    const text = response.text.trim();

    const clean = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(clean);
}

async function inferPresentation(name) {
    if (!name || !process.env.GEMINI_API_KEY) return "";

    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `Given only the first name "${name}", what gender presentation is it most commonly associated with? Respond with exactly one word: "man", "woman", or "person" (use "person" if the name is genuinely unisex or you are unsure). No punctuation, no explanation, one word only.`,
        });

        const answer = response.text.trim().toLowerCase();

        if (answer.includes("woman")) return "woman";
        if (answer.includes("man")) return "man";
        return "";
    } catch (err) {
        console.warn("Presentation inference failed:", err.message);
        return "";
    }
}

export async function generateStory(req, res) {

    try {

        const answers = req.body;

        const missing = findMissingFields(answers);
        if (missing.length > 0) {
            return res.status(400).json({
                error: `Missing required answers: ${missing.join(", ")}`,
            });
        }

        let story;

        try {

            story = await generateWithGemini(answers);

        } catch (err) {

            console.warn("Gemini failed. Using fallback story. Reason:", err.message);

            story = buildFallbackStory(answers);

        }

        console.log("Generating images...");

        const presentation =
            answers?.gender === "male" ? "man" :
            answers?.gender === "female" ? "woman" :
            await inferPresentation(answers?.name);

        const images = await generateStoryImages(story.chapters, answers?.name, presentation);

        story.images = images;

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie(SESSION_COOKIE_NAME, createSessionCookieValue(), {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            maxAge: SESSION_TTL_MS,
            path: "/",
        });

        console.log("Story completed.");

        return res.json(story);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: err.message,
        });

    }

}

export function checkStorySession(req, res) {
    const authorized = isSessionValid(req.cookies?.[SESSION_COOKIE_NAME]);
    return res.json({ authorized });
}
