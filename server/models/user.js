const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    displayName: String,
    profilePicture: {
        type: String,
        default: "default.jpg"
    },
    saved: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }],
})

module.exports = mongoose.model("User", userSchema)