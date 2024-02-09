import mongoose from "mongoose";
const Schema = mongoose.Schema

const commentSchema = new Schema({
    post: Schema.Types.ObjectId,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    content: String,
    reaction: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
}, {
    timestamps: true
})

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;