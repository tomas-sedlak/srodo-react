import Post from "../models/Post.js";

// CREATE
export const createPost = async (req, res) => {
    try {
        const {
            userId,
            postType,
            subject,
            coverImage,
            title,
            content,
        } = req.body;

        const newPost = new Post({
            userId,
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
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// UPDATE
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes.splice(userId, 1);
        } else {
            post.likes.push(userId);
        }

        post.save();

        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};