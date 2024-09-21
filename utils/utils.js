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

export const generateToken = (length = 32) => {
    return crypto.randomBytes(length).toString("hex")
}