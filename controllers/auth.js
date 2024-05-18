import { uploadImage, getObject } from "../utils/s3.js";
import { getProfilePicture } from "../utils/utils.js";
import { generateUsername } from "unique-username-generator";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import hbs from "handlebars";
import fs from "fs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from "axios";

var transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }
});

const compileTemplate = async (templatePath, data) => {
    const rawTemplate = fs.readFileSync(templatePath, "utf8");
    const template = hbs.compile(rawTemplate);
    return template(data);
};

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

        const user = new User({
            displayName: username,
            username: username,
            email: email,
            password: passwordHash,
            verifyKey: crypto.randomBytes(32).toString("hex"),
        });

        await user.save();

        const url = `https://srodo.sk/api/user/verify/${user.verifyKey}`;
        const emailContent = await compileTemplate("email_templates/verify.hbs", { url });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Overenie emailovej adresy Šrodo.sk",
            text: `Pre overenie klikni na URL: ${url}`,
            html: emailContent,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email: ", error);
            } else {
                console.log("Email sent: ", info.response);
            }
        });

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const verify = async (req, res) => {
    try {
        const { verifyKey } = req.params;
        const user = await User.findOne({ verifyKey });

        if (!user)  return res.status(400).send("invalid Key!");

        user.verified = true;
        user.verifyKey = undefined;
        await user.save();

        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// LOGGING IN
export const login = async (req, res) => {
    try {
        const { usernameOrEmail, loginPassword } = req.body;
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] }).lean();
        if (!user) return res.status(400).json({ message: "User does not exist." });

        const isMatch = await bcrypt.compare(loginPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

        // Load images from s3 bucket
        user.coverImage = await getObject(user.coverImage);
        await getProfilePicture(user.profilePicture);

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
            const profilePicture = {
                thumbnail: await uploadImage(response.data.picture, 76, 76),
                large: await uploadImage(response.data.picture, 400, 400),
            };

            user = await User.create({
                username, email, displayName, profilePicture
            })
        }

        // Load images from s3 bucket
        user.coverImage = await getObject(user.coverImage);
        await getProfilePicture(user.profilePicture);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}