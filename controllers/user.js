import User from "../models/User.js";
import Post from "../models/Post.js";
import mongoose from "mongoose";
import sharp from "sharp";
import axios from "axios";

// READ
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ $or: [{ "id_": id }, { "username": id }] });

        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ author: userId })
            .sort({ createdAt: -1 })
            .populate("author", "username displayName profilePicture")
            .populate("subject");

        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserFavourites = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ likes: userId })
            .populate("author", "username displayName profilePicture")
            .populate("subject");

        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUnique= async (req, res) => {
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
}

// UPDATE
export const updateUserSettings = async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId != req.user.id) {
            return res.status(403).send("Access Denied");
        }

        const {
            coverImage,
            profilePicture,
            displayName,
            bio,
            socials,
        } = req.body;

        const coverImageUrl = await uploadImage(coverImage, 600, 200);
        const profilePictureUrl = await uploadImage(profilePicture, 92, 92);

        const user = await User.findOneAndUpdate({
            _id: userId
        }, {
            coverImage: coverImageUrl,
            profilePicture: profilePictureUrl,
            displayName: displayName,
            bio: bio,
            socials: socials,
        }, {
            new: true,
        });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const uploadImage = async (image, width, height) => {
    if (!image.match("^(http|https)://")) return image;

    const response = await axios.get(image, {
        responseType: "arraybuffer",
    })
    const buffer = Buffer.from(response.data, "base64")

    const croppedImageBuffer = await sharp(buffer)
        .resize(width, height)
        .toBuffer();

    const imageUrl = `data:image/jpeg;base64,${croppedImageBuffer.toString("base64")}`;
    return imageUrl;
}