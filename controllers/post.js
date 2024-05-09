import { deleteObject, getObject, uploadFile, uploadImage } from "../middleware/s3.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Group from "../models/Group.js";
import axios from "axios";
import Image from "../models/Image.js";
import File from "../models/File.js";

// CREATE
export const createPost = async (req, res) => {
    try {
        const {
            groupId,
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
            groupId,
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
        const { page = 1, limit = 10, userId } = req.query;

        const groups = await Group.find({ members: userId })
            .select("_id");

        const posts = await Post.find({ groupId: { $in: groups } })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1))
            .populate("author", "username displayName profilePicture")
            .populate("images", "thumbnail large")
            .populate("files", "file name size")
            .lean();

        const cache = {}
        for (const post of posts) {
            if (!cache[post.author._id]) {
                cache[post.author._id] = await getObject(post.author.profilePicture);
            }
            post.author.profilePicture = cache[post.author._id];

            for (const image of post.images) {
                image.thumbnail = await getObject(image.thumbnail);
                image.large = await getObject(image.large);
            }

            for (const file of post.files) {
                file.file = await getObject(file.file);
            }

            const comments = await Comment.find({ postId: post._id });
            post.comments = comments.length;
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
            .populate("author", "username displayName profilePicture")
            .populate("images", "thumbnail large")
            .populate("files", "file name size")
            .lean();

        post.author.profilePicture = await getObject(post.author.profilePicture);

        for (const image of post.images) {
            image.thumbnail = await getObject(image.thumbnail);
            image.large = await getObject(image.large);
        }

        for (const file of post.files) {
            file.file = await getObject(file.file);
        }

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

        const cache = {}
        for (const comment of comments) {
            if (!cache[comment.author._id]) {
                cache[comment.author._id] = await getObject(comment.author.profilePicture);
            }
            comment.author.profilePicture = cache[comment.author._id];
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