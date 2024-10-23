import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { rateLimit } from "express-rate-limit";

// ROUTES
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import groupRoutes from "./routes/group.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comment.js";
import quizRoutes from "./routes/quiz.js";

// CONTROLLERS
import { createPost } from "./controllers/post.js";
import { createComment } from "./controllers/comment.js";
import { createGroup, updateGroup } from "./controllers/group.js";
import { updateUserSettings } from "./controllers/user.js";
import { verifyToken } from "./middleware/auth.js";
import { generateQuiz } from "./controllers/ai.js";

// CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 60, // Limit each IP to 60 requests per `window` (here, per 1 minute).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// Redirect from www to non-www
app.use((req, res, next) => {
  if (req.hostname === "www.srodo.sk") {
    return res.redirect(301, `https://srodo.sk${req.originalUrl}`);
  }
  next();
});
app.use(limiter)
app.use(express.json());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [
        "'self'",
        "https://pagead2.googlesyndication.com", // Allow scripts from Google Ad Services
        "https://ep1.adtrafficquality.google",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://accounts.google.com",
        "https://*.googleapis.com" // Allow Google APIs
      ],
      imgSrc: [
        "'self'",
        `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com` // Allow images from S3 bucket
      ],
      frameSrc: [
        "'self'",
        "https://pagead2.googlesyndication.com", // Allow scripts from Google Ad Services
        "https://accounts.google.com",
      ],
      connectSrc: [
        "'self'",
        "https://region1.google-analytics.com",
        "https://ep1.adtrafficquality.google",
        "https://accounts.google.com", // Allow OAuth connections
        "https://*.googleapis.com" // Allow connection to Google APIs
      ],
      formAction: [
        "'self'",
        "https://accounts.google.com",
      ]
    }
  }
}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Allow only Vite's local development server
}));

// FILE STORAGE
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ROUTES WITH FILES
app.post("/api/post", verifyToken, upload.fields([{ name: "images", maxCount: 4 }, { name: "files", maxCount: 4 }]), createPost);
app.post("/api/comment", verifyToken, upload.fields([{ name: "images", maxCount: 4 }, { name: "files", maxCount: 4 }]), createComment);
app.post("/api/group", verifyToken, upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "profilePicture", maxCount: 1 }]), createGroup);
app.patch("/api/user/:userId/update", verifyToken, upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "profilePicture", maxCount: 1 }]), updateUserSettings);
app.patch("/api/group/:groupId/update", verifyToken, upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "profilePicture", maxCount: 1 }]), updateGroup);
app.post("/api/ai", upload.fields([{ name: "file", maxCount: 1 }]), generateQuiz);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/quiz", quizRoutes);

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