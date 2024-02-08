import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// ROUTES
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
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
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "public/images")));

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// ROUTES WITH FILES
app.post("/api/auth/register", upload.single("profilePicture"), register);
app.post("/api/post", verifyToken, upload.single("coverImage"), createPost);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/news", newsRoutes);

// PRODUCTION REACT ROUTES
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/dist/index.html"));
  });
}

// MONGOOSE SETUP
console.log(process.env.PORT)
const PORT = process.env.PORT || 5000;
mongoose
  .connect("mongodb+srv://tsedlak24:a9LDaNzdAbUbQicQ@srodo.wererc7.mongodb.net/srodo?retryWrites=true&w=majority")
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));