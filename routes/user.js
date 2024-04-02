import express from "express";
import {
  getUser,
  getUserPosts,
  getUserFavourites,
  updateUserSettings,
  getUnique,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/unique", getUnique);
router.get("/:id", getUser);
router.get("/:userId/posts", getUserPosts);
router.get("/:userId/favourites", getUserFavourites);

/* UPDATE */
router.patch("/:userId/update", verifyToken, updateUserSettings);

export default router;