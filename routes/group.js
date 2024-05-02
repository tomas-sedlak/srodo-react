import express from "express";
import {
    getGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
} from "../controllers/group.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.get("/:groupId", getGroup);

// UPDATE
router.patch("/:groupId/join", verifyToken, joinGroup);
router.patch("/:groupId/leave", verifyToken, leaveGroup);

// DELETE
router.delete("/:groupId", verifyToken, deleteGroup);

export default router;