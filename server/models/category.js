const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    image: String,
    label: String,
    emoji: String,
    url: String,
    description: String
})

module.exports = mongoose.model("Category", categorySchema)