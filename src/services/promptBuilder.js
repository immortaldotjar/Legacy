const ART_STYLE = `
Award-winning illustrated concept art.

Modern editorial illustration.

Anime-inspired.

Bold clean outlines.

Painterly brush strokes.

Soft textured shading.

Rich cinematic lighting.

Volumetric light.

Golden hour.

Emotional storytelling.

Highly detailed environment.

Film still composition.

Beautiful color grading.

Masterpiece quality.

NOT photorealistic.

NOT CGI.

NOT 3D.

NOT text.

NOT watermark.
`;

export function createChapterPrompt({
  title,
  content,
  mood,
  character = "",
}) {
  return `
${ART_STYLE}

Main Character:
${character}

Chapter:
${title}

Scene:
${content}

Mood:
${mood}

Requirements:

• Portrait (9:16)

• One main character

• Rich environment

• Cinematic framing

• Dynamic camera angle

• Beautiful lighting

• Emotional atmosphere

• Consistent illustration style

• No text

• No logos

• No watermark

This should look like a beautiful frame from an award-winning animated documentary.
`;
}