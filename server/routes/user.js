import express from "express";
import {
  getUser,
  addSaved,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);

/* UPDATE */
router.patch("/:id/save", verifyToken, addSaved);

export default router;