import { deleteObject, uploadFile, uploadImage } from "../utils/s3.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Group from "../models/Group.js";
import Image from "../models/Image.js";
import File from "../models/File.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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
        const { page = 1, limit = 10 } = req.query;

        let token = req.header("Authorization") && req.header("Authorization").split(" ")[1];

        if (!token) {
            return res.status(200).json([]);
        }

        const userId = jwt.verify(token, process.env.JWT_SECRET)?.id;

        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: "groups",
                    localField: "group",
                    foreignField: "_id",
                    as: "groups",
                    pipeline: [
                        {
                            $project: {
                                members: 1,
                            }
                        }
                    ]
                }
            },
            {
                $match: { "groups.members": new mongoose.Types.ObjectId(userId) }
            },
            {
                $skip: limit * (page - 1)
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "group",
                    foreignField: "_id",
                    as: "group",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                profilePicture: 1,
                                owner: 1,
                                isPrivate: 1,
                            }
                        }
                    ]
                }
            },
            {
                $unwind: { path: "$group" },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                displayName: 1,
                                profilePicture: 1,
                            }
                        }
                    ]
                }
            },
            {
                $unwind: { path: "$author" },
            },
            {
                $lookup: {
                    from: "images",
                    localField: "images",
                    foreignField: "_id",
                    as: "images",
                }
            },
            {
                $lookup: {
                    from: "files",
                    localField: "files",
                    foreignField: "_id",
                    as: "files",
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    as: "comments",
                }
            },
            {
                $addFields: {
                    isLiked: { $in: [new mongoose.Types.ObjectId(userId), "$likes"] },
                    likes: { $size: "$likes" },
                    comments: { $size: "$comments" },
                }
            },
            {
                $project: {
                    group: 1,
                    author: 1,
                    content: 1,
                    images: 1,
                    files: 1,
                    quiz: 1,
                    isLiked: 1,
                    likes: 1,
                    comments: 1,
                    createdAt: 1,
                }
            },
        ]);

        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const { postId } = req.params;

        let userId = null;
        let token = req.header("Authorization") && req.header("Authorization").split(" ")[1];

        if (token) {
            userId = jwt.verify(token, process.env.JWT_SECRET)?.id;
        }

        const post = await Post.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(postId) }
            },
            {
                $lookup: {
                    from: "groups",
                    localField: "group",
                    foreignField: "_id",
                    as: "group",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                profilePicture: 1,
                                owner: 1,
                                isPrivate: 1,
                            }
                        }
                    ]
                }
            },
            {
                $unwind: { path: "$group" },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                displayName: 1,
                                profilePicture: 1,
                            }
                        }
                    ]
                }
            },
            {
                $unwind: { path: "$author" },
            },
            {
                $lookup: {
                    from: "images",
                    localField: "images",
                    foreignField: "_id",
                    as: "images",
                }
            },
            {
                $lookup: {
                    from: "files",
                    localField: "files",
                    foreignField: "_id",
                    as: "files",
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    as: "comments",
                }
            },
            {
                $addFields: {
                    isLiked: { $in: [new mongoose.Types.ObjectId(userId), "$likes"] },
                    likes: { $size: "$likes" },
                    comments: { $size: "$comments" },
                }
            },
            {
                $project: {
                    group: 1,
                    author: 1,
                    content: 1,
                    images: 1,
                    files: 1,
                    quiz: 1,
                    isLiked: 1,
                    likes: 1,
                    comments: 1,
                    createdAt: 1,
                }
            }
        ]);

        res.status(200).json(post[0]);
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