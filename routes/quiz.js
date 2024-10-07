import express from "express";
import { getQuiz } from "../controllers/quiz.js";

const router = express.Router();

router.get("/:quizId", getQuiz);

export default router;