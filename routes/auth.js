import express from "express";
import { google, login, register, resetPassword, resetPasswordConfirm, verify } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", google);
router.post("/reset-password", resetPassword);
router.post("/reset-password/:token", resetPasswordConfirm);
router.get("/verify/:verifyEmailToken", verify);

export default router;