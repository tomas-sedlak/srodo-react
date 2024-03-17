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

// UPDATE
export const addSaved = async (req, res) => {
    try {
        const { id } = req.params;
        const { postId } = req.body;
        const user = await User.findById(id);
        const isSaved = user.saved.includes(postId);

        if (isSaved) {
            user.saved.pull(postId);
        } else {
            user.saved.push(postId);
        }

        await user.save();

        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const uploadProfilePicture = async (req, res) => {
    try {
        const { userId } = req.params;
        const { url } = req.body;
        const response = await axios.get(url, {
            responseType: "arraybuffer",
        })
        const buffer = Buffer.from(response.data, "base64")

        const croppedImageBuffer = await sharp(buffer)
            .resize(92, 92)
            .toBuffer();

        const user = await User.findById(userId);
        const imageUrl = `data:image/jpeg;base64,${croppedImageBuffer.toString("base64")}`;
        user.profilePicture = imageUrl;
        await user.save();

        res.status(200).send("Success");
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ message: err.message })
    }
}