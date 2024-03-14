import express from "express";
import {
    getSubjects,
    getSubject
} from "../controllers/subjects.js";

const router = express.Router();

// READ
router.get("/", getSubjects);
router.get("/:subjectLabel", getSubject);

export default router;