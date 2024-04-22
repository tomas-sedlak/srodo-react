import express from "express";
import {
    createGroup,
    getGroup,
    joinGroup,
    editGroup,
    deleteGroup,
} from "../controllers/group.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// CREATE
router.post("/", verifyToken, createGroup);

// READ
router.get("/:groupId", getGroup);

// UPDATE
router.patch("/:groupId/join", verifyToken, joinGroup);
router.patch("/:groupId/edit", verifyToken, editGroup);

// DELETE
router.delete("/:groupId", verifyToken, deleteGroup);

export default router;