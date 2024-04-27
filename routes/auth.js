import express from "express";
import { login } from "../controllers/auth.js";
import passport from "passport";

const router = express.Router();

router.post("/login", login);
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }))
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/novinky" }))

export default router;