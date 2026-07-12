import streamifier from "streamifier";
import sharp from "sharp";
import cloudinary from "./cloudinary.js";

const ART_STYLE = `
Retro-futuristic anime poster art, in the style of 1980s-90s Japanese sci-fi anime key art (Akira, Bubblegum Crisis, Ghost in the Shell posters).
Bold, clean, confident black ink outlines around every shape.
Flat cel-shading with crisp, distinct color blocks - NOT soft gradients, NOT painterly blending, NOT airbrushed, NOT soft textured shading.
High-contrast, highly saturated pop-art color palette: vivid teal or cyan flat backgrounds, hot magenta/pink accents on mechanical or clothing details, deep cobalt blue, warm cream and mustard-yellow tones, warm sun-kissed skin tones.
Shading rendered as large flat shadow shapes and a few sharp specular highlight streaks, not photographic or naturalistic lighting.
Vector-clean edges, striking poster silhouette, graphic novel / comic-book illustration finish.
Where mechanical or sci-fi elements appear, render bolts, joints, and machinery in the same flat-color, thick-outline treatment as the rest of the piece.
Masterpiece quality, gallery print poster.
Portrait orientation.
Tasteful, safe-for-work, family-friendly documentary illustration. No violence, no gore, no weapons pointed at people, no nudity or suggestive content.
NOT photorealistic. NOT CGI. NOT 3D render. NOT soft painterly brushwork. NOT muted or desaturated colors. NOT text. NOT watermark.
`.trim();

function buildPrompt(chapter, name, presentation, softenRetry = false) {
    const subject = presentation ? `${presentation} character` : "character";

    return `
${presentation ? `The main character is a ${presentation.toUpperCase()}. This is a firm requirement - depict a ${presentation}, not any other gender.\n` : ""}${name ? `Character name: ${name}\n` : ""}
${ART_STYLE}

Title:
${chapter.title}

Scene:
${chapter.content}

Mood:
${chapter.mood}

Create ONE cinematic illustration.
${softenRetry ? "\nThe scene should be interpreted symbolically and metaphorically rather than literally - favor calm, gentle, everyday imagery over anything intense, dramatic, or confrontational.\n" : ""}
Requirements:
- One main ${subject}
- Dynamic, graphic pose or camera angle
- Emotional storytelling through pose and color, not lighting realism
- Rich but flat-shaded environment
- Bold, saturated color grading matching the retro anime poster palette
- Portrait (9:16)
`.trim();
}

function uploadBuffer(buffer, fileName) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "legacy",
                public_id: fileName,
                overwrite: true,
            },
            (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
}

// A real, intentionally dark/moody illustration still has variance between
// pixels (edges, highlights, color). A safety-filter blackout is both very
// dark AND almost perfectly uniform across every pixel - that combination
// is what actually distinguishes "blank frame" from "just a dark scene".
async function isBlankFrame(buffer) {
    try {
        const stats = await sharp(buffer).stats();
        const channels = stats.channels.slice(0, 3);
        const avgMean = channels.reduce((sum, c) => sum + c.mean, 0) / channels.length;
        const avgStdev = channels.reduce((sum, c) => sum + c.stdev, 0) / channels.length;

        return avgMean < 8 && avgStdev < 4;
    } catch (err) {
        console.warn("Could not inspect image, skipping blank-frame check:", err.message);
        return false;
    }
}

async function requestImage(prompt, workerUrl, apiKey) {
    const response = await fetch(workerUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    const contentType = response.headers.get("content-type") || "";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!contentType.startsWith("image/") || buffer.length === 0) {
        throw new Error(`Worker did not return an image (content-type: ${contentType || "unknown"}, bytes: ${buffer.length})`);
    }

    return buffer;
}

export async function generateImage(chapter, name, presentation) {
    const WORKER_URL = process.env.CF_WORKER_URL;
    const API_KEY = process.env.CF_API_KEY;

    if (!WORKER_URL || !API_KEY) {
        console.error("Image Generation Error: Missing CF_WORKER_URL or CF_API_KEY");
        return null;
    }

    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            // On the retry, soften the scene text in case a specific word
            // (weapon, fire, storm, blood, etc.) is what tripped the filter.
            const prompt = buildPrompt(chapter, name, presentation, attempt > 1);

            const buffer = await requestImage(prompt, WORKER_URL, API_KEY);

            if (await isBlankFrame(buffer)) {
                console.warn(`Chapter "${chapter.title}" came back as a blank/black frame (attempt ${attempt}) - likely a safety filter false-positive.`);
                if (attempt < 2) continue;
                return null;
            }

            return await uploadBuffer(buffer, `chapter-${Date.now()}`);

        } catch (err) {
            console.error(`Image Generation Error (attempt ${attempt}):`, err.message);
            if (attempt === 2) return null;
        }
    }

    return null;
}

export async function generateStoryImages(chapters, name, presentation) {

    return await Promise.all(
        chapters.map(async (chapter) => ({
            title: chapter.title,
            image: await generateImage(chapter, name, presentation),
        }))
    );

}