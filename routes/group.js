import express from "express";
import {
    getGroupSuggestions,
    getGroup,
    getGroupPosts,
    getGroupMembers,
    getInvite,
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
router.get("/:groupId/members", getGroupMembers);
router.get("/invite/:privateKey", verifyToken, getInvite);

// UPDATE
router.patch("/:groupId/join", verifyToken, joinGroup);
router.patch("/:groupId/leave", verifyToken, leaveGroup);

// DELETE
router.delete("/:groupId", verifyToken, deleteGroup);

export default router;