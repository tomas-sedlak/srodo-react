import express from "express";
import {
  getUser,
  getUnique,
  getUserPosts,
  getUserGroups,
  getUserFavourites,
  updateUserSettings,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", getUser);
router.get("/unique", getUnique);
router.get("/:userId/posts", getUserPosts);
router.get("/:userId/groups", getUserGroups);
router.get("/:userId/favourites", getUserFavourites);

/* UPDATE */
router.patch("/:userId/update", verifyToken, updateUserSettings);

export default router;