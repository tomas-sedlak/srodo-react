import Group from "../models/Group.js";
import sharp from "sharp";
import axios from "axios";

// CREATE
export const createGroup = async (req, res) => {
    try {
        const {
            coverImage,
            name,
            description,
            isPrivate,
        } = req.body;

        const response = await axios.get(coverImage, {
            responseType: "arraybuffer",
        })
        const buffer = Buffer.from(response.data, "base64")

        const croppedImageBuffer = await sharp(buffer)
            .resize(800, 400)
            .toBuffer();

        const imageUrl = `data:image/jpeg;base64,${croppedImageBuffer.toString("base64")}`;

        const newGroup = new Group({
            coverImage: imageUrl,
            name,
            description,
            isPrivate,
            owner: req.user.id,
        });
        await newGroup.save();

        res.status(201).json(newGroup);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

// READ
export const getGroup = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId)
            .populate("author", "username displayName profilePicture")
            .populate("subject")
            .lean();

        const comments = await Comment.find({ postId: post._id });
        post.comments = comments.length;

        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// UPDATE
export const editGroup = async (req, res) => {
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

// DELETE
export const deleteGroup = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (post.author != req.user.id) {
            return res.status(403).send("Access Denied");
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).send("Success");
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}