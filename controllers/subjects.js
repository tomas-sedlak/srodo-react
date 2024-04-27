import Post from "../models/Post.js";
import Subject from "../models/Subject.js";

// READ
export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find()
            .sort("index");

        res.status(200).json(subjects);
    } catch (err) {
        res.status(404).json({ mesage: err.message });
    }
}

export const getSubject = async (req, res) => {
    try {
        const { subjectLabel } = req.params;
        const subject = await Subject.findOne({ url: subjectLabel }).lean();

        const posts = await Post.find({ subject: subject._id })
            .populate("author", "username displayName profilePicture")
            .populate("subject")
            .lean();
        subject.posts = posts;

        res.status(200).json(subject);
    } catch (err) {
        res.status(404).json({ mesage: err.message });
    }
}