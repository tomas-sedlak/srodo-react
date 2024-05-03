import { getImage, uploadImage } from "../middleware/s3.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Group from "../models/Group.js";

// READ
export const getUser = async (req, res) => {
    try {
        let user;
        if (req.query.userId) {
            user = await User.findOne({ _id: req.query.userId });
        } else if (req.query.username) {
            user = await User.findOne({ username: req.query.username });
        }

        // Load images from s3 bucket
        user.coverImage = await getImage(user.coverImage);
        user.profilePicture = await getImage(user.profilePicture);

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
        const users = await User.find();

        // Load images from s3 bucket
        for (const user of users) {
            user.profilePicture = await getImage(user.profilePicture);
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
            .populate("author", "username displayName profilePicture");

        // Load images from s3 bucket
        for (const post of posts) {
            post.author.profilePicture = await getImage(post.author.profilePicture);
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
            group.profilePicture = await getImage(group.profilePicture);
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
            .populate("author", "username displayName profilePicture");

        // Load images from s3 bucket
        for (const post of posts) {
            post.author.profilePicture = await getImage(post.author.profilePicture);
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

        const {
            displayName,
            bio,
            socials,
        } = req.body;

        // Upload images to s3 bucket
        const coverImage = req.files.coverImage && await uploadImage(req.files.coverImage[0], 600, 200);
        const profilePicture = req.files.profilePicture && await uploadImage(req.files.profilePicture[0], 128, 128);

        const user = await User.findOneAndUpdate({
            _id: userId
        }, {
            coverImage,
            profilePicture,
            displayName,
            bio,
            socials,
        }, {
            new: true,
        });

        const userData = {
            _id: user._id,
            username: user.username,
            displayName: user.displayName,
            profilePicture: await getImage(user.profilePicture),
        }

        res.status(200).send(userData);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}