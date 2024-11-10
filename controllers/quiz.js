import Quiz from "../models/Quiz.js";
import jwt from "jsonwebtoken";

export const getQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId);

        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

export const getQuizHistory = async (req, res) => {
    try {
        let token = req.header("Authorization") && req.header("Authorization").split(" ")[1];

        if (!token) {
            return res.status(200).json([]);
        }

        const userId = jwt.verify(token, process.env.JWT_SECRET)?.id;

        const quiz = await Quiz.find({ author: userId })
            .sort({ createdAt: -1 })
            .select("title createdAt");

        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}