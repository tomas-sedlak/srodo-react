const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new Schema({
    author: Schema.Types.ObjectId,
    content: String,
    reaction: Schema.Types.ObjectId,
}, {
    timestamps: true
})

module.exports = mongoose.model("Comment", commentSchema)