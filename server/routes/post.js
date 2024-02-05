import express from "express";
import {
    createPost,
    getFeedPosts,
    likePost
} from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// CREATE
router.post("/create", verifyToken, createPost);

// READ
router.get("/", getFeedPosts);

// UPDATE
router.patch("/:postId/like", verifyToken, likePost);

export default router;