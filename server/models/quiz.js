import mongoose from "mongoose";
const Schema = mongoose.Schema

const quizSchema = new Schema({
    question: String,
    image: String,
    options: [String],
    correctOption: String,
})

const Quiz = mongoose.model("Quiz", quizSchema)

export default Quiz;