import Post from "../models/Post.js";
import Subject from "../models/Subject.js" // NECCESSARY FOR POPULATING

// CREATE
export const createPost = async (req, res) => {
    try {
        const {
            author,
            postType,
            subject,
            coverImage,
            title,
            content,
        } = req.body;

        const newPost = new Post({
            author,
            postType,
            subject,
            coverImage,
            title,
            content,
        });
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

// READ
export const getFeedPosts = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 3;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1))
            .populate("author", "username displayName profilePicture")
            .populate("subject")

        res.status(200).json(posts);
    } catch (err) {
        console.log("err")
        res.status(404).json({ message: err.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId)
            .populate("author", "username displayName profilePicture")
            .populate("subject")

        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// UPDATE
export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(postId)
            .populate("author", "username displayName profilePicture")
            .populate("subject")
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};