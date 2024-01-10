const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    displayName: String,
    profilePicture: {
        type: String,
        default: "default.jpg"
    },
})

module.exports = mongoose.model("User", userSchema)