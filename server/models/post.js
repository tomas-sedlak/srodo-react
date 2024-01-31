import mongoose from "mongoose";
const Schema = mongoose.Schema

const postSchema = new Schema({
    postType: String,
    coverImage: String,
    title: {
        type: String,
        max: 64,
    },
    content: String,
    quiz: [{
        type: Schema.Types.ObjectId,
        ref: "Quiz",
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
    },
    likes: [Schema.Types.ObjectId],
    comments: [Schema.Types.ObjectId],
}, {
    timestamps: true
})

const Post = mongoose.model("Post", postSchema);

export default Post;