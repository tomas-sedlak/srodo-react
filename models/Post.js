import mongoose from "mongoose";
const Schema = mongoose.Schema

const postSchema = new Schema({
    groupId: Schema.Types.ObjectId,
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
    likes: [Schema.Types.ObjectId],
}, {
    timestamps: true
})

const Post = mongoose.model("Post", postSchema);

export default Post;