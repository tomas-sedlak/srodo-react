import { uploadImage } from "../utils/s3.js";
import { compileEmailTemplate, generateToken, sendMail } from "../utils/utils.js";
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

        // Check if username and email is unique
        const sameUsername = await User.find({ username });
        if (sameUsername.length > 0) {
            return res.status(400).send("Toto používateľské meno sa už používa");
        }

        const sameEmail = await User.find({ email });
        if (sameEmail.length > 0) {
            return res.status(400).send("Tento email sa už používa");
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const verifyEmailToken = generateToken();

        await User.create({
            displayName: username,
            username,
            email,
            verifyEmailToken,
            verified: false,
            password: passwordHash,
            loginMethod: "email",
        });

        const url = `https://srodo.sk/overenie-emailu/${verifyEmailToken}`;
        const emailContent = await compileEmailTemplate("email_templates/verify.hbs", { url });

        const mailOptions = {
            from: "Šrodo.sk <no-reply@srodo.sk>",
            to: email,
            subject: "Over svoj e-mail",
            text: `Pripravený získať 100% na teste? Over svoje konto a začni používať Šrodo naplno: ${url}`,
            html: emailContent,
        };

        sendMail(mailOptions);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export const verify = async (req, res) => {
    try {
        const { verifyEmailToken } = req.params;
        const user = await User.findOne({ verifyEmailToken });

        if (!user) return res.status(400).send("Nesprávna URL adresa.");

        user.verifiedEmail = true;
        user.verifyEmailToken = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;

        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// LOGGING IN
export const login = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] }).lean();

        if (!user) return res.status(400).send("Nesprávne prihlasovacie údaje.");
        if (!user.verifiedEmail) return res.status(400).send("Email ešte nie je overený.");
        if (user.loginMethod !== "email") return res.status(400).send("Iný spôsob prihlásenia.");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send("Nesprávne prihlasovacie údaje.");

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// GOOGLE LOG IN / REIGUSTER USER
export const google = async (req, res) => {
    try {
        const { accessToken } = req.body;

        const response = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        );

        const email = response.data.email;
        let user = await User.findOne({ email });

        if (user && user.loginMethod !== "google") return res.status(400).send("Iný spôsob prihlásenia.");
        if (!user) {
            const username = generateUsername();
            const displayName = response.data.name;
            const profilePicture = {
                thumbnail: await uploadImage(response.data.picture, 76, 76),
                large: await uploadImage(response.data.picture, 400, 400),
            };

            user = await User.create({
                username,
                email,
                displayName,
                profilePicture,
                verifiedEmail: true,
                loginMethod: "google",
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// RESET PASSWORD
export const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send("Používateľ nebol nájdený.");
        if (user.loginMethod !== "email") return res.status(400).send("Iný spôsob prihlásenia.");

        const resetToken = generateToken();
        user.resetPassword.token = resetToken;
        user.resetPassword.expires = Date.now() + 3600000; // 1 hour
        await user.save();

        const url = `https://srodo.sk/resetovat-heslo/${resetToken}`;
        const emailContent = await compileEmailTemplate("email_templates/reset_password.hbs", { url });

        const mailOptions = {
            from: "Šrodo.sk <no-reply@srodo.sk>",
            to: email,
            subject: "Obnovenie hesla",
            text: `Po kliknutí na link nižšie budeš presmerovaný na stránku, kde vytvoríš svoje nové heslo: ${url} (Link je platný iba 1 hodinu od generácie)`,
            html: emailContent,
        }
        sendMail(mailOptions);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const resetPasswordConfirm = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { token } = req.params;

        const user = await User.findOne({
            "resetPassword.token": token,
            "resetPassword.expires": { $gt: Date.now() },
        })
        if (!user) return res.status(404).send("Nesprávny alebo neplatný token.");

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newPassword, salt);

        user.password = passwordHash;
        user.resetPassword = null;
        await user.save();

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message);
    }
}