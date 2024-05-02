import { getImage, uploadImage } from "../middleware/s3.js";
import Group from "../models/Group.js";

// CREATE
export const createGroup = async (req, res) => {
    try {
        const {
            name,
            description,
            isPrivate,
        } = req.body;

        // Upload images to s3 bucket
        const coverImage = req.files.coverImage && await uploadImage(req.files.coverImage[0], 800, 400);
        const profilePicture = req.files.profilePicture && await uploadImage(req.files.profilePicture[0], 128, 128);

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
            .populate("owner", "username displayName profilePicture")
            .populate("members", "username displayName profilePicture");

        // Load images from s3 bucket
        group.coverImage = await getImage(group.coverImage);
        group.profilePicture = await getImage(group.profilePicture);
        group.owner.profilePicture = await getImage(group.owner.profilePicture);
        for (const member of group.members) {
            member.profilePicture = await getImage(member.profilePicture);
        }

        res.status(200).json(group);
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

        await Group.findByIdAndDelete(posgroupIdtId);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}