import express from "express";
import {
  getUser,
  getUserPosts,
  getUserFavourites,
  addSaved,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", getUser);
router.get("/:userId/posts", getUserPosts);
router.get("/:userId/favourites", getUserFavourites);

/* UPDATE */
router.patch("/:id/save", verifyToken, addSaved);

export default router;