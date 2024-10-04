import express from "express";
import { generateQuiz } from "../controllers/ai.js";

const router = express.Router();

router.post("/generate", generateQuiz);

export default router;