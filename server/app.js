import express from "express";
import cors from "cors";

import storyRoutes from "./routes/storyRoutes.js"

const app = express();

app.use(cors());

app.use(express.json({ limit: "20mb" }));

app.use("/api/story", storyRoutes);

export default app;