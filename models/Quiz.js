import mongoose from "mongoose";
const Schema = mongoose.Schema

const quizSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    method: {
        type: String,
        enum: ["text", "file", "image"],
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