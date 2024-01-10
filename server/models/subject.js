const mongoose = require("mongoose")

const subjectSchema = new mongoose.Schema({
    index: Number,
    label: String,
    emoji: String,
    url: String,
    image: String,
    description: String
})

module.exports = mongoose.model("Subject", subjectSchema)