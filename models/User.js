import mongoose from "mongoose"
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        max: 32,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        max: 320,
        required: true,
        unique: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verifyKey: String,
    password: String,
    loginMethod: {
        type: String,
        enum: ["email", "google"],
        required: true,
    },
    displayName: {
        type: String,
        max: 32,
    },
    profilePicture: {
        thumbnail: String,
        large: String,
    },
    coverImage: {
        type: String,
    },
    bio: {
        type: String,
        max: 160,
        trim: true,
        default: "",
    },
    socials: [{
        type: {
            platform: String,
            icon: String,
            displayText: String,
            url: String,
        },
        maxLength: 5,
    }],
}, {
    timestamps: true,
})

const User = mongoose.model("User", userSchema);

export default User;