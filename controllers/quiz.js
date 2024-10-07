import Quiz from "../models/Quiz.js";

export const getQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId);

        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}