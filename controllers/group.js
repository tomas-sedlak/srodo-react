import { deleteObject, uploadImage } from "../utils/s3.js";
import Group from "../models/Group.js";
import Post from "../models/Post.js";
import normalizeStrings from "normalize-strings";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Comment from "../models/Comment.js";
import mongoose from "mongoose";

// CREATE
export const createGroup = async (req, res) => {
    try {
        const {
            name,
            description,
            isPrivate,
        } = req.body;

        // Upload images to s3 bucket
        let coverImage = null;
        if (req.files.coverImage) {
            coverImage = await uploadImage(req.files.coverImage[0], 1080, 360);
        } else if (req.body.coverImage) {
            coverImage = await uploadImage(req.body.coverImage, 1080, 360);
        }

        let profilePicture = {};
        if (req.files.profilePicture) {
            profilePicture.thumbnail = await uploadImage(req.files.profilePicture[0], 76, 76);
            profilePicture.large = await uploadImage(req.files.profilePicture[0], 400, 400);
        } else if (req.body.profilePicture) {
            profilePicture.thumbnail = await uploadImage(req.body.profilePicture, 76, 76);
            profilePicture.large = await uploadImage(req.body.profilePicture, 400, 400);
        }

        let privateKey = undefined;
        if (isPrivate) privateKey = crypto.randomBytes(16).toString("hex");

        const group = await Group.create({
            coverImage,
            profilePicture,
            name,
            description,
            isPrivate,
            privateKey,
            owner: req.user.id,
            members: [req.user.id],
        });

        res.status(201).json({ id: group._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ
export const getGroup = async (req, res) => {
    try {
        const { groupId } = req.params;

        let userId = null;
        let token = req.header("Authorization") && req.header("Authorization").split(" ")[1];

        if (token) {
            userId = jwt.verify(token, process.env.JWT_SECRET)?.id;
        }

        const group = await Group.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(groupId) }
            },
            {
                $addFields: {
                    isMember: { $in: [new mongoose.Types.ObjectId(userId), "$members"] },
                    membersCount: { $size: "$members" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "members",
                    foreignField: "_id",
                    as: "members",
                    pipeline: [
                        { $limit: 5 },
                        { $project: { profilePicture: 1 } }
                    ]
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    coverImage: 1,
                    profilePicture: 1,
                    isPrivate: 1,
                    privateKey: 1,
                    owner: 1,
                    members: 1,
                    membersCount: 1,
                    isMember: 1,
                    createdAt: 1,
                    verified: 1,
                }
            }
        ]);

        if (group[0].isPrivate && !group[0].isMember) {
            return res.status(403).send("Access denied!");
        }

        if (!group[0].owner.equals(userId)) {
            group[0].privateKey = undefined;
        }

        res.status(200).json(group[0]);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getGroupPosts = async (req, res) => {
    try {
        const { groupId } = req.params;

        let userId = null;
        let token = req.header("Authorization") && req.header("Authorization").split(" ")[1];

        if (token) {
            userId = jwt.verify(token, process.env.JWT_SECRET)?.id;
        }

        const posts = await Post.aggregate([
            {
                $match: { group: new mongoose.Types.ObjectId(groupId) }
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
                                verified: 1,
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
            {
                $sort: { createdAt: -1 }
            }
        ]);

        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getGroupMembers = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { q = "" } = req.query;

        const normalizedQuery = normalizeStrings(q);
        const regexQuery = new RegExp(normalizedQuery.replace(/[^\w\s]/gi, ""), "i");

        const { members } = await Group.findById(groupId)
            .select("members")
            .populate({
                path: "members",
                select: "username displayName profilePicture",
                match: {
                    $or: [
                        { username: regexQuery },
                        { displayName: regexQuery },
                    ]
                }
            })
            .lean();

        res.status(200).json(members);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getGroupSuggestions = async (req, res) => {
    try {
        const { q = "" } = req.query;

        const groups = await Group.aggregate([
            {
                $match: {
                    name: { $regex: q, $options: "i" },
                    isPrivate: false,
                }
            },
            {
                $addFields: {
                    membersCount: { $size: "$members" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "members",
                    foreignField: "_id",
                    as: "members",
                    pipeline: [
                        { $limit: 5 },
                        { $project: { profilePicture: 1 } }
                    ]
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    profilePicture: 1,
                    members: 1,
                    membersCount: 1,
                    verified: 1,
                }
            }
        ]);

        res.status(200).json(groups);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getInvite = async (req, res) => {
    try {
        const { privateKey } = req.params;

        const group = await Group.findOne({ privateKey });

        if (!group.members.includes(req.user.id)) {
            group.members.push(req.user.id);
            await group.save();
        }

        res.status(200).send(group._id);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

// UPDATE
export const joinGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId);

        if (!group.members.includes(req.user.id)) {
            group.members.push(req.user.id);
            await group.save();
        }

        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId);

        if (group.members.includes(req.user.id)) {
            group.members.pull(req.user.id);
            await group.save();
        }

        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId);

        if (!group.owner._id.equals(req.user.id)) {
            return res.status(403).send("Access Denied");
        }

        const {
            name,
            description
        } = req.body;

        // Upload images to s3 bucket;
        if (req.files.coverImage) {
            await deleteObject(group.coverImage);
            group.coverImage = await uploadImage(req.files.coverImage[0], 1080, 360);
        } else if (req.body.coverImage == "") {
            await deleteObject(group.coverImage);
            group.coverImage = "";
        } else if (req.body.coverImage) {
            await deleteObject(group.coverImage);
            group.coverImage = await uploadImage(req.body.coverImage, 1080, 360);
        }

        if (req.files.profilePicture) {
            await deleteObject(group.profilePicture.thumbnail);
            await deleteObject(group.profilePicture.large);
            group.profilePicture.thumbnail = await uploadImage(req.files.profilePicture[0], 76, 76);
            group.profilePicture.large = await uploadImage(req.files.profilePicture[0], 400, 400);
        } else if (req.body.profilePicture == "") {
            await deleteObject(group.profilePicture.thumbnail);
            await deleteObject(group.profilePicture.large);
            group.profilePicture.thumbnail = "";
            group.profilePicture.large = "";
        } else if (req.body.profilePicture) {
            await deleteObject(group.profilePicture.thumbnail);
            await deleteObject(group.profilePicture.large);
            group.profilePicture.thumbnail = await uploadImage(req.body.profilePicture, 76, 76);
            group.profilePicture.large = await uploadImage(req.body.profilePicture, 400, 400);
        }

        if (name) group.name = name;
        if (description) group.description = description;

        await group.save();

        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// DELETE
export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId);

        if (group.owner != req.user.id) {
            return res.status(403).send("Access Denied");
        }

        await deleteObject(group.coverImage);
        await deleteObject(group.profilePicture.thumbnail);
        await deleteObject(group.profilePicture.large);
        await Group.findByIdAndDelete(groupId);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}