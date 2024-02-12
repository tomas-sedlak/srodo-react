import mongoose from "mongoose";
const Schema = mongoose.Schema

const commentSchema = new Schema({
    post: Schema.Types.ObjectId,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    content: String,
    upvotes: [Schema.Types.ObjectId],
    downvotes: [Schema.Types.ObjectId],
}, {
    timestamps: true
})

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;