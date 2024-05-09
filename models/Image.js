import mongoose from "mongoose";
const Schema = mongoose.Schema

const imageSchema = new Schema({
    author: mongoose.Types.ObjectId,
    thumbnail: String,
    large: String,
})

const Image = mongoose.model("Image", imageSchema);

export default Image;