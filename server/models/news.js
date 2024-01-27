import mongoose from "mongoose";
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

const News = mongoose.model("News", newsSchema);

export default News;