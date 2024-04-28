import express from "express";
import { google, login } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/google", google)

export default router;