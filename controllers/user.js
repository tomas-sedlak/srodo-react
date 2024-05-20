import { deleteObject, getObject, uploadImage } from "../utils/s3.js";
import { getPostUtil, getProfilePicture } from "../utils/utils.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Group from "../models/Group.js";
import Comment from "../models/Comment.js";

// READ
export const getUser = async (req, res) => {
    try {
        let user;
        if (req.query.userId) {
            user = await User.findById(req.query.userId);
        } else if (req.query.username) {
            user = await User.findOne({ username: req.query.username });
        }

        // Load images from s3 bucket
        user.coverImage = await getObject(user.coverImage);
        await getProfilePicture(user.profilePicture);

        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUnique = async (req, res) => {
    try {
        const query = req.query;
        const result = await User.find(query)

        if (result.length > 0) {
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
        const users = await User.find({ verified: true }).lean();

        // Load images from s3 bucket
        for (const user of users) {
            await getProfilePicture(user.profilePicture);
        }

        res.status(200).json(users);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ author: userId })
            .sort({ createdAt: -1 })
            .populate("group", "name profilePicture isPrivate")
            .populate("author", "username displayName profilePicture")
            .populate("images", "thumbnail large")
            .populate("files", "file name size")
            .lean();

        // Load images from s3 bucket
        let cache = {};
        for (const post of posts) {
            await getPostUtil(post, cache);
        }

        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserGroups = async (req, res) => {
    try {
        const { userId } = req.params;
        const groups = await Group.find({ members: userId });

        // Load images from s3 bucket
        for (const group of groups) {
            await getProfilePicture(group.profilePicture);
        }

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

        // Load images from s3 bucket
        let cache = {};
        for (const post of posts) {
            await getPostUtil(post, cache);
        }

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

        if (displayName) user.displayName = displayName;
        if (bio) user.bio = bio;
        if (socials) user.socials = JSON.parse(socials);

        await user.save();

        user.coverImage = await getObject(user.coverImage);
        await getProfilePicture(user.profilePicture);
        res.status(200).send(user);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}