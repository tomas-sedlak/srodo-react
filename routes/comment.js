import express from "express";
import {
  upvoteComment,
  downvoteComment,
} from "../controllers/comment.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* UPDATE */
router.patch("/:commentId/upvote", verifyToken, upvoteComment);
router.patch("/:commentId/downvote", verifyToken, downvoteComment);

export default router;