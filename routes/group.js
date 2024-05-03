import express from "express";
import {
    getGroupSuggestions,
    getGroup,
    getGroupPosts,
    joinGroup,
    leaveGroup,
    deleteGroup,
} from "../controllers/group.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.get("/suggestions", getGroupSuggestions);
router.get("/:groupId", getGroup);
router.get("/:groupId/posts", getGroupPosts);

// UPDATE
router.patch("/:groupId/join", verifyToken, joinGroup);
router.patch("/:groupId/leave", verifyToken, leaveGroup);

// DELETE
router.delete("/:groupId", verifyToken, deleteGroup);

export default router;