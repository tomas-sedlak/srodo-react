const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    index: Number,
    label: String,
    emoji: String,
    url: String,
    image: String,
    description: String
})

module.exports = mongoose.model("Category", categorySchema)