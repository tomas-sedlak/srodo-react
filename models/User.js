import mongoose from "mongoose"
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        min: [1, "Minimálna dĺžka je 1 znak"],
        max: [32, "Maximálna dĺžka je 32 znakov"],
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
        type: String,
        default: "default.jpg",
    },
}, {
    timestamps: true,
})

const User = mongoose.model("User", userSchema);

export default User;