import Subject from "../models/Subject.js";

// READ
export const getSubjects = async (req, res) => {
    try{
        const subjects = await Subject.find()
            .sort("index");

        res.status(200).json(subjects);
    } catch (err) {
        res.status(404).json({ mesage: err.message });
    }
}