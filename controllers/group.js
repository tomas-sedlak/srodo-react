import { deleteObject, getObject, uploadImage } from "../utils/s3.js";
import { getPostUtil, getProfilePicture } from "../utils/utils.js";
import Group from "../models/Group.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import File from "../models/File.js";
import Image from "../models/Image.js";
import normalizeStrings from "normalize-strings";

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

        const group = await Group.create({
            coverImage,
            profilePicture,
            name,
            description,
            isPrivate,
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
        const group = await Group.findById(groupId)
            .populate("members", "username displayName profilePicture")
            .lean();

        // Load images from s3 bucket
        group.coverImage = await getObject(group.coverImage);
        await getProfilePicture(group.profilePicture);
        for (const member of group.members) {
            await getProfilePicture(member.profilePicture);
        }

        res.status(200).json(group);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getGroupPosts = async (req, res) => {
    try {
        const { groupId } = req.params;
        const posts = await Post.find({ groupId })
            .sort({ createdAt: -1 })
            .populate("author", "username displayName profilePicture")
            .populate("images", "thumbnail large")
            .populate("files", "file name size")
            .lean();

        // Loading images from s3 bucket using memoization to improve performance
        const cache = {};
        for (const post of posts) {
            await getPostUtil(post, cache);
        }

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

        // Load images from s3 bucket
        for (const member of members) {
            await getProfilePicture(member.profilePicture);
        }

        res.status(200).json(members);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getGroupSuggestions = async (req, res) => {
    try {
        const groups = await Group.find().lean();

        // Load images from s3 bucket
        for (const group of groups) {
            await getProfilePicture(group.profilePicture);
        }

        res.status(200).json(groups);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// UPDATE
export const joinGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId);

        if (!group.members.includes(req.user.id)) {
            group.members.push(req.user.id);
        }

        await group.save();
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
        }

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