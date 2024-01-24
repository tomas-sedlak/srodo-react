const mongoose = require("mongoose")
const Schema = mongoose.Schema

const quizzSchema = new Schema({
    question: String,
    image: String,
    options: [String],
    correctOption: Number,
})

module.exports = mongoose.model("News", quizzSchema)