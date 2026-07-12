import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import storyRoutes from "./routes/storyRoutes.js"

const app = express();

// origin: true reflects the requesting origin (rather than "*"), which is
// required for credentials: true to work - browsers refuse to send/store
// cookies on cross-origin requests against a wildcard origin.
app.use(cors({ origin: true, credentials: true }));

app.use(cookieParser());

app.use(express.json({ limit: "20mb" }));

app.use("/api/story", storyRoutes);

export default app;