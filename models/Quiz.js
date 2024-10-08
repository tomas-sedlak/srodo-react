import mongoose from "mongoose";
const Schema = mongoose.Schema

const quizSchema = new Schema({
    title: String,
    questions: [{
        question: String,
        answers: [String],
        correctAnswer: Number,
        explanation: String,
    }],
})

const Quiz = mongoose.model("Quiz", quizSchema)

export default Quiz;