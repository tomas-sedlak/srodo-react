import Comment from "../models/Comment.js";

// UPDATE
export const upvoteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;

        const comment = await Comment.findById(commentId);

        if (comment.downvotes.includes(userId)) {
            comment.downvotes.pull(userId);
        }

        if (comment.upvotes.includes(userId)) {
            comment.upvotes.pull(userId);
        } else {
            comment.upvotes.push(userId);
        }

        await comment.save();

        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const downvoteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;

        const comment = await Comment.findById(commentId);

        if (comment.upvotes.includes(userId)) {
            comment.upvotes.pull(userId);
        }

        if (comment.downvotes.includes(userId)) {
            comment.downvotes.pull(userId);
        } else {
            comment.downvotes.push(userId);
        }

        await comment.save();

        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELTE
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);

        if (comment.author != req.user.id) {
            return res.status(403).send("Access Denied");
        }

        await Comment.findByIdAndDelete(commentId);

        res.status(200).send("Success");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}