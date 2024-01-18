const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    displayName: String,
    profilePicture: {
        type: String,
        default: "default.jpg"
    },
    // saved: [{
    //     type: String,
    //     ref: "Post"
    // }],
    saved: [],
})

module.exports = mongoose.model("User", userSchema)