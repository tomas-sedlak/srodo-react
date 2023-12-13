const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: String,
    displayName: String,
    profilePicture: {
        type: String,
        default: "default.jpg"
    },
})

module.exports = mongoose.model("User", userSchema)