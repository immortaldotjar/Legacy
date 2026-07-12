import express from "express";
import { generateStory, checkStorySession } from "../services/storyService.js";

const router = express.Router();

router.post("/", generateStory);
router.get("/session", checkStorySession);

export default router;