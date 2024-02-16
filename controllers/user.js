import User from "../models/User.js";
import Post from "../models/Post.js";

// READ
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ $or: [ { "id_": id }, { "username": id } ] });
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ author: userId })
            .sort({ createdAt: -1 })
            .populate("author", "username displayName profilePicture")
            .populate("subject")

        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// UPDATE
export const addSaved = async (req, res) => {
    try {
        const { id } = req.params;
        const { postId } = req.body;
        const user = await User.findById(id);
        const isSaved = user.saved.includes(postId);

        if (isSaved) {
            user.saved.pull(postId);
        } else {
            user.saved.push(postId);
        }

        user.save();

        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};