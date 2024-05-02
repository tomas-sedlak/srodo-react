import express from "express";
import {
  getUser,
  getUnique,
  getUserPosts,
  getUserGroups,
  getUserFavourites,
} from "../controllers/user.js";

const router = express.Router();

/* READ */
router.get("/", getUser);
router.get("/unique", getUnique);
router.get("/:userId/posts", getUserPosts);
router.get("/:userId/groups", getUserGroups);
router.get("/:userId/favourites", getUserFavourites);

export default router;