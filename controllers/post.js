import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
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

        res.status(201).json(newPost);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

export const createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { author, content } = req.body;

        const comment = new Comment({
            postId,
            author,
            content,
        });
        await comment.save();

        res.status(201).json(comment);
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}

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
            .populate("comment")

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
            .populate("comment")

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
        res.status(500).json({ message: err.message });
    }
};

export const viewPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        const today = new Date().toISOString().split("T")[0];
        const view = post.views.find(v => v.date.toISOString().split("T")[0] === today);

        if (view) {
            view.count += 1;
        } else {
            post.views.push({ date: today, count: 1 });
        }

        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}