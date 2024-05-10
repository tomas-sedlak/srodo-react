import mongoose from "mongoose";
const Schema = mongoose.Schema

const commentSchema = new Schema({
    postId: Schema.Types.ObjectId,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        trim: true,
    },
    images: [{
        type: Schema.Types.ObjectId,
        default: [],
        ref: "Image",
    }],
    gif: String,
    files: [{
        type: Schema.Types.ObjectId,
        default: [],
        ref: "File",
    }],
    quiz: [{
        type: Schema.Types.ObjectId,
        ref: "Quiz",
    }],
    upvotes: [Schema.Types.ObjectId],
    downvotes: [Schema.Types.ObjectId],
}, {
    timestamps: true
})

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;