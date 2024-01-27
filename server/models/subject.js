import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    index: Number,
    label: String,
    emoji: String,
    url: String,
    image: String,
    description: String
})

const Subject = mongoose.model("Subject", subjectSchema)

export default Subject;