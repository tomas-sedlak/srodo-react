const mongoose = require("mongoose")
const Schema = mongoose.Schema

const quizSchema = new Schema({
    question: String,
    image: String,
    options: [String],
    correctOption: String,
})

module.exports = mongoose.model("Quiz", quizSchema)