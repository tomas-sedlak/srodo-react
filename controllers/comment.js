import { uploadImage } from "../utils/s3.js";
import Comment from "../models/Comment.js";

// CREATE
export const createComment = async (req, res) => {
    try {
        const {
            postId,
            content,
            gif,
            quiz,
        } = req.body;

        // Upload files to s3 bucket
        let images = [];
        if (req.files.images) {
            for (const image of req.files.images) {
                const newImage = await Image.create({
                    author: req.user.id,
                    thumbnail: await uploadImage(image, 800),
                    large: await uploadImage(image),
                })
                images.push(newImage._id);
            }
        }

        let files = [];
        if (req.files.files) {
            for (const file of req.files.files) {
                const newFile = await File.create({
                    author: req.user.id,
                    file: await uploadFile(file),
                    name: file.originalname,
                    size: file.size,
                })
                files.push(newFile._id);
            }
        }

        await Comment.create({
            postId,
            author: req.user.id,
            content,
            images,
            files,
            gif,
            quiz,
        });

        res.sendStatus(201);
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}

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