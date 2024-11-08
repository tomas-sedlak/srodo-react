import express from "express";
import {
    getGroups,
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
router.get("/search", getGroups);
router.get("/suggestions", getGroups);
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