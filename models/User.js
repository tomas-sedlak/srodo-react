import mongoose from "mongoose"
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        max: 32,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        max: 255,
        required: true,
        unique: true,
    },
    password: String,
    displayName: {
        type: String,
        max: 32,
    },
    profilePicture: {
        type: String,
        default: "default.jpg"
    },
    saved: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }],
}, {
    timestamps: true,
})

const User = mongoose.model("User", userSchema);

export default User;