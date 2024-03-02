import express from "express";
import {
    createComment,
    getFeedPosts,
    getPost,
    getPostComments,
    editPost,
    likePost,
    viewPost,
    deletePost,
} from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// CREATE
router.post("/:postId/comment", verifyToken, createComment);

// READ
router.get("/", getFeedPosts);
router.get("/:postId", getPost);
router.get("/:postId/comments", getPostComments);

// UPDATE
router.patch("/:postId/edit", verifyToken, editPost);
router.patch("/:postId/like", verifyToken, likePost);
router.patch("/:postId/view", viewPost);

// DELETE
router.delete("/:postId", verifyToken, deletePost);

export default router;