import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Subject from "../models/Subject.js" // NECCESSARY FOR POPULATING
import sharp from "sharp";
import axios from "axios";
import mongoose from "mongoose";

// CREATE
export const createPost = async (req, res) => {
    try {
        const {
            groupId,
            content,
            image,
            gif,
            attachemnt,
            quiz,
        } = req.body;

        const response = await axios.get(image, {
            responseType: "arraybuffer",
        })
        const buffer = Buffer.from(response.data, "base64")

        const croppedImageBuffer = await sharp(buffer)
            .resize(800, 400)
            .toBuffer();

        const imageUrl = `data:image/jpeg;base64,${croppedImageBuffer.toString("base64")}`;

        const newPost = new Post({
            groupId,
            author: req.user.id,
            content,
            image: imageUrl,
            gif,
            attachemnt,
            quiz,
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
        const { page = 1, limit = 3 } = req.query;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1))
            .populate("author", "username displayName profilePicture")
            .lean();

        await Promise.all(
            posts.map(async post => {
                const comments = await Comment.find({ postId: post._id });
                post.comments = comments.length;
            })
        );

        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId)
            .populate("author", "username displayName profilePicture")
            .lean();

        const comments = await Comment.find({ postId: post._id });
        post.comments = comments.length;

        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ postId })
            .sort({ createdAt: -1 })
            .populate("author", "username displayName profilePicture")

        comments.sort((a, b) => {
            return (b.upvotes.length - b.downvotes.length) - (a.upvotes.length - a.downvotes.length);
        })

        res.status(200).json(comments);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// UPDATE
export const editPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (post.author != req.user.id) {
            return res.status(403).send("Access Denied");
        }

        const {
            subject,
            coverImage,
            title,
            content,
        } = req.body;

        post.subject = subject;
        post.title = title;
        post.content = content;

        if (post.coverImage != coverImage) {
            const response = await axios.get(coverImage, {
                responseType: "arraybuffer",
            })
            const buffer = Buffer.from(response.data, "base64")

            const croppedImageBuffer = await sharp(buffer)
                .resize(800, 400)
                .toBuffer();

            const imageUrl = `data:image/jpeg;base64,${croppedImageBuffer.toString("base64")}`;

            post.coverImage = imageUrl;
        }

        await post.save();

        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        const isLiked = post.likes.includes(req.user.id);
        if (isLiked) {
            post.likes.pull(req.user.id);
        } else {
            post.likes.push(req.user.id);
        }

        await post.save();

        res.sendStatus(200);
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

// DELETE
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (post.author != req.user.id) {
            return res.status(403).send("Access Denied");
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).send("Success");
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}