import express from "express";
import { getQuiz, getQuizHistory } from "../controllers/quiz.js";

const router = express.Router();

router.get("/", getQuizHistory);
router.get("/:quizId", getQuiz);

export default router;