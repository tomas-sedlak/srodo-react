import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
// import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import passport from "passport";
import { fileURLToPath } from "url";
import { rateLimit } from "express-rate-limit";

// ROUTES
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import groupRoutes from "./routes/group.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comment.js";
import subjectsRoutes from "./routes/subjects.js";
import newsRoutes from "./routes/news.js";

// CONTROLLERS
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/post.js";
import { verifyToken } from "./middleware/auth.js";

// CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
	limit: 60, // Limit each IP to 60 requests per `window` (here, per 1 minute).
	standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(limiter)
app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// FILE STORAGE
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ROUTES WITH FILES
app.post("/api/auth/register", upload.single("profilePicture"), register);
app.post("/api/post", verifyToken, createPost);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/news", newsRoutes);

// PRODUCTION REACT ROUTES
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/dist/index.html"));
  });
}

// MONGOOSE SETUP
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));