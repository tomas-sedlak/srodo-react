import express from "express";
import { getNews } from "../controllers/news.js";

const router = express.Router();

// READ
router.get("/", getNews);

export default router;