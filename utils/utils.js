import { getObject } from "./s3.js";
import Comment from "../models/Comment.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import hbs from "handlebars";
import fs from "fs";

var transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }
});

export const compileEmailTemplate = async (templatePath, data) => {
    const rawTemplate = fs.readFileSync(templatePath, "utf8");
    const template = hbs.compile(rawTemplate);
    return template(data);
};

export const sendMail = (mailOptions) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
}

export const getPostUtil = async (post, cache = {}) => {
    if (post.group?._id && !cache[post.group._id]) {
        cache[post.group._id] = await getProfilePicture(post.group.profilePicture);
    }
    if (!cache[post.author._id]) {
        cache[post.author._id] = await getProfilePicture(post.author.profilePicture);
    }

    if (post.group?._id) post.group.profilePicture = cache[post.group._id];
    post.author.profilePicture = cache[post.author._id];

    for (const image of post.images) {
        image.thumbnail = await getObject(image.thumbnail);
        image.large = await getObject(image.large);
    }

    for (const file of post.files) {
        file.file = await getObject(file.file);
    }

    const comments = await Comment.find({ postId: post._id });
    post.comments = comments.length;
}

export const getProfilePicture = async (profilePicture) => {
    if (!profilePicture) return;
    profilePicture.thumbnail = await getObject(profilePicture.thumbnail);
    profilePicture.large = await getObject(profilePicture.large);
    return profilePicture
}

export const generateToken = (length = 32) => {
    return crypto.randomBytes(length).toString("hex")
}