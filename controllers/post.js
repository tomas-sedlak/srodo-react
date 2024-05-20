import { deleteObject, getObject, uploadFile, uploadImage } from "../utils/s3.js";
import { getPostUtil } from "../utils/utils.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Group from "../models/Group.js";
import Image from "../models/Image.js";
import File from "../models/File.js";
import axios from "axios";

// CREATE
export const createPost = async (req, res) => {
    try {
        const {
            group,
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

        await Post.create({
            group,
            author: req.user.id,
            content,
            images,
            files,
            gif,
            quiz,
        });

        res.sendStatus(201);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

// READ
export const getFeedPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, userId } = req.query;

        const groups = await Group.find({ members: userId })
            .select("_id");

        const posts = await Post.find({ group: { $in: groups } })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1))
            .populate("group", "name profilePicture owner isPrivate")
            .populate("author", "username displayName profilePicture")
            .populate("images", "thumbnail large")
            .populate("files", "file name size")
            .lean();

        const cache = {}
        for (const post of posts) {
            await getPostUtil(post, cache);
        }

        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId)
            .populate("group", "name profilePicture owner isPrivate")
            .populate("author", "username displayName profilePicture")
            .populate("images", "thumbnail large")
            .populate("files", "file name size")
            .lean();

        await getPostUtil(post);

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
            .populate("images", "thumbnail large")
            .populate("files", "file name size")
            .lean();

        comments.sort((a, b) => {
            return (b.upvotes.length - b.downvotes.length) - (a.upvotes.length - a.downvotes.length);
        })

        const cache = {}
        for (const comment of comments) {
            await getPostUtil(comment, cache);
        }

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

        await deleteObject(post.image);
        await Post.findByIdAndDelete(postId);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}