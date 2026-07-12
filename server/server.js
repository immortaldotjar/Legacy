import dotenv from "dotenv";
dotenv.config();
const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log("Gemini configured:", Boolean(process.env.GEMINI_API_KEY));
    console.log("Cloudflare Worker configured:", Boolean(process.env.CF_WORKER_URL && process.env.CF_API_KEY));
    console.log("Cloudinary configured:", Boolean(process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_KEY));
    console.log("Session secret configured:", Boolean(process.env.SESSION_SECRET));
});