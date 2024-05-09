import { getObject, uploadImage } from "../middleware/s3.js";
import { generateUsername } from "unique-username-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from "axios";

// REGISTER USER
export const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            displayName: username,
            username: username,
            email: email,
            password: passwordHash,
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// LOGGING IN
export const login = async (req, res) => {
    try {
        const { usernameOrEmail, loginPassword } = req.body;
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] }).lean();
        if (!user) return res.status(400).json({ message: "User does not exist." });

        const isMatch = await bcrypt.compare(loginPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

        // Load images from s3 bucket
        user.profilePicture = await getObject(user.profilePicture);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GOOGLE LOG IN / REIGUSTER USER
export const google = async (req, res) => {
    try {
        const { accessToken } = req.body;

        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const email = response.data.email;
        let user = await User.findOne({ email });

        if (!user) {
            const username = generateUsername();
            const displayName = response.data.name;
            const profilePicture = await uploadImage(response.data.picture);

            user = await User.create({
                username, email, displayName, profilePicture
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}