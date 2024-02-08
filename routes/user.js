import express from "express";
import {
  getUser,
  getUserPosts,
  addSaved,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", getUser);
router.get("/:userId/posts", getUserPosts);

/* UPDATE */
router.patch("/:id/save", verifyToken, addSaved);

export default router;