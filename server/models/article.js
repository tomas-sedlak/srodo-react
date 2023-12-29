const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema({
    image: String,
    title: String,
    content: String,
    author: String
}, {
    timestamps: true
})

module.exports = mongoose.model("Article", articleSchema)