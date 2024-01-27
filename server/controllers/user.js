import User from "../models/User.js";

// READ
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
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
            user.saved.splice(postId, 1);
        } else {
            user.saved.push(postId);
        }

        user.save();

        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};