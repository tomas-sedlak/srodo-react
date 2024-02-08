import express from "express";
import { getSubjects } from "../controllers/subjects.js";

const router = express.Router();

// READ
router.get("/", getSubjects);

export default router;