import mongoose from "mongoose";
const Schema = mongoose.Schema

const quizSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title: String,
    questions: [{
        question: String,
        answers: [String],
        correctAnswer: Number,
        explanation: String,
    }],
}, {
    timestamps: true,
})

const Quiz = mongoose.model("Quiz", quizSchema)

export default Quiz;