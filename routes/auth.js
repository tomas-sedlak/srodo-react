import express from "express";
import { google, login, register, verify } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", google);
router.get("/verify/:verifyKey", verify);

export default router;