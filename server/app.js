import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import storyRoutes from "./routes/storyRoutes.js"

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(cookieParser());

app.use(express.json({ limit: "20mb" }));

app.use("/api/story", storyRoutes);

export default app;