import express from "express";
import { generateStory } from "../services/storyService.js";

const router = express.Router();

router.post("/", generateStory);

export default router;