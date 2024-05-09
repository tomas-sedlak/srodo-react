import mongoose from "mongoose";
const Schema = mongoose.Schema

const fileSchema = new Schema({
    author: mongoose.Types.ObjectId,
    file: String,
    name: String,
    size: Number,
})

const File = mongoose.model("File", fileSchema);

export default File;