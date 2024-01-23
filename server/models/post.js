const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    postType: String,
    coverImage: String,
    title: String,
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
    },
    likes: [{
        type: [Schema.Types.ObjectId],
        default: [],
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: [],
    }],
}, {
    timestamps: true
})

module.exports = mongoose.model("Post", postSchema)