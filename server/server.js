import dotenv from "dotenv";
dotenv.config();

// Dynamic import matters here: a static `import app from "./app.js"` gets
// hoisted and evaluated before dotenv.config() above ever runs, which is
// exactly what was breaking GEMINI_API_KEY / CF_WORKER_URL - modules further
// down the import tree were reading process.env before it was populated.
const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Gemini configured:", Boolean(process.env.GEMINI_API_KEY));
    console.log("Cloudflare Worker configured:", Boolean(process.env.CF_WORKER_URL && process.env.CF_API_KEY));
    console.log("Cloudinary configured:", Boolean(process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_KEY));
    console.log("Session secret configured:", Boolean(process.env.SESSION_SECRET));
});