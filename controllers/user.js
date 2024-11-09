import { deleteObject, uploadImage } from "../utils/s3.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Group from "../models/Group.js";
import Comment from "../models/Comment.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const forbiddenUsernames = ["ai", "preskumat", "skupiny", "kviz", "ucet", "prihlasenie", "registracia", "vytvorit", "overenie-emailu", "pozvanka", "resetovat-heslo"];

// READ
export const getUser = async (req, res) => {
    try {
        let user;
        if (req.query.userId) {
            user = await User.findById(req.query.userId);
        } else if (req.query.username) {
            user = await User.findOne({ username: req.query.username });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUnique = async (req, res) => {
    try {
        const query = req.query;
        const result = await User.find(query)

        if (forbiddenUsernames.includes(username) || result.length > 0) {
            res.status(200).json({ unique: false });
        } else {
            res.status(200).json({ unique: true });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUserSuggestions = async (req, res) => {
    try {
        const ids = ["664d045d0776e0770cc47e34", "664ddbf6c781ebff57563eff", "66501bd19cb989885bcbade2", "664daddec781ebff57563e0f"];
        
        const users = await User.find({ _id: { $in: ids } })
            .select("profilePicture displayName username verified")
            .lean();

        res.status(200).json(users);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const { q = "" } = req.query;

        const users = await User.find({ $or: [{ username: { $regex: q, $options: "i" } }, { displayName: { $regex: q, $options: "i" } }] })
            .select("profilePicture displayName username verified")
            .lean();

        res.status(200).json(users);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        let anotherUserId = null;
        let token = req.header("Authorization") && req.header("Authorization").split(" ")[1];

        if (token) {
            anotherUserId = jwt.verify(token, process.env.JWT_SECRET)?.id;
        }

        const posts = await Post.aggregate([
            {
                $match: { author: new mongoose.Types.ObjectId(userId) }
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
                $match: { "group.isPrivate": false }
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
                    isLiked: { $in: [new mongoose.Types.ObjectId(anotherUserId), "$likes"] },
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

        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserGroups = async (req, res) => {
    try {
        const { userId } = req.params;
        const groups = await Group.find({ members: userId });

        res.status(200).json(groups);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserFavourites = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ likes: userId })
            .populate("author", "username displayName profilePicture")
            .populate("images", "thumbnail large")
            .populate("files", "file name size")
            .lean();

        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

// UPDATE
export const updateUserSettings = async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId != req.user.id) {
            return res.status(403).send("Access Denied");
        }

        const user = await User.findById(userId).select("-password");

        const {
            username,
            displayName,
            bio,
            socials,
        } = req.body;

        // Upload images to s3 bucket;
        if (req.files.coverImage) {
            await deleteObject(user.coverImage);
            user.coverImage = await uploadImage(req.files.coverImage[0], 1080, 360);
        } else if (req.body.coverImage == "") {
            await deleteObject(user.coverImage);
            user.coverImage = "";
        } else if (req.body.coverImage) {
            await deleteObject(user.coverImage);
            user.coverImage = await uploadImage(req.body.coverImage, 1080, 360);
        }

        if (req.files.profilePicture) {
            await deleteObject(user.profilePicture.thumbnail);
            await deleteObject(user.profilePicture.large);
            user.profilePicture.thumbnail = await uploadImage(req.files.profilePicture[0], 76, 76);
            user.profilePicture.large = await uploadImage(req.files.profilePicture[0], 400, 400);
        } else if (req.body.profilePicture == "") {
            await deleteObject(user.profilePicture.thumbnail);
            await deleteObject(user.profilePicture.large);
            user.profilePicture.thumbnail = "";
            user.profilePicture.large = "";
        } else if (req.body.profilePicture) {
            await deleteObject(user.profilePicture.thumbnail);
            await deleteObject(user.profilePicture.large);
            user.profilePicture.thumbnail = await uploadImage(req.body.profilePicture, 76, 76);
            user.profilePicture.large = await uploadImage(req.body.profilePicture, 400, 400);
        }

        if (username) {
            const result = await User.find({ username });
            if (forbiddenUsernames.includes(username) || result.length > 0) {
                throw new Error("Toto používateľské meno už existuje.")
            } else {
                user.username = username;
            }
        }
        if (displayName) user.displayName = displayName;
        if (bio) user.bio = bio;
        if (socials) user.socials = JSON.parse(socials);

        await user.save();

        res.status(200).send(user);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}