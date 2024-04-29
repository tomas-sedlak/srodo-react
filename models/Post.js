import mongoose from "mongoose";
const Schema = mongoose.Schema

const postSchema = new Schema({
    groupId: Schema.Types.ObjectId,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    coverImage: String,
    content: String,
    quiz: [{
        type: Schema.Types.ObjectId,
        ref: "Quiz",
    }],
    views: [{
        date: Date,
        count: Number,
    }],
    likes: [Schema.Types.ObjectId],
}, {
    timestamps: true
})

const Post = mongoose.model("Post", postSchema);

export default Post;