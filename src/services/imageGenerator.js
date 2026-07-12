import { createChapterPrompt } from "./promptBuilder";
export async function generateStoryImages(story) {
  const images = [];

  for (const chapter of story.chapters) {
    const prompt = createChapterPrompt({
      title: chapter.title,
      content: chapter.content,
      mood: "cinematic",
      character: story.character?.appearance || "",
    });

    const imageUrl =
      "https://image.pollinations.ai/prompt/" +
      encodeURIComponent(prompt) +
      "?width=720&height=1280&model=flux&nologo=true";

    images.push({
      title: chapter.title,
      image: imageUrl,
    });
  }

  return images;
}