import express from "express";
import {
    getFeedPosts,
    getPost,
    likePost
} from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.get("/", getFeedPosts);
router.get("/:postId", getPost);

// UPDATE
router.patch("/:postId/like", verifyToken, likePost);

export default router;