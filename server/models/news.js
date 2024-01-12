const mongoose = require("mongoose")
const Schema = mongoose.Schema

const newsSchema = new Schema({
    category: String,
    author: String,
    title: String,
    url: String,
    image: String,
    index: Number,
    timestamp: Date,
})

module.exports = mongoose.model("News", newsSchema)