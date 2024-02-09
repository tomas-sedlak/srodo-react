import express from "express";
import {
    getFeedPosts,
    getPost,
    likePost,
    viewPost,
} from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.get("/", getFeedPosts);
router.get("/:postId", getPost);

// UPDATE
router.patch("/:postId/like", verifyToken, likePost);
router.patch("/:postId/view", verifyToken, viewPost);

export default router;