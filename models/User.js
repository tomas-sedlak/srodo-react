import mongoose from "mongoose"
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        min: [1, "Minimálna dĺžka je 1 znak"],
        max: [16, "Maximálna dĺžka je 32 znakov"],
        required: [true, "Používateľské meno je povinné"],
        unique: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        max: [320, "Príliš dlhý email"],
        required: [true, "Email je povinný"],
        unique: true,
    },
    password: String,
    displayName: {
        type: String,
        max: 32,
    },
    profilePicture: {
        thumbnail: String,
        large: String,
        // default: "/images/default_profile.jpg",
    },
    coverImage: {
        type: String,
        // default: "/images/default_cover.jpg",
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
    verified: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
})

const User = mongoose.model("User", userSchema);

export default User;