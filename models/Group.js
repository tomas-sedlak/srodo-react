import mongoose from "mongoose";
const Schema = mongoose.Schema

const groupSchema = new Schema({
    coverImage: {
        type: String,
        default: "",
    },
    profilePicture: {
        thumbnail: String,
        large: String,
    },
    name: {
        type: String,
        max: 64,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        max: 160,
        trim: true,
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    privateKey: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    verified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

const Group = mongoose.model("Group", groupSchema);

export default Group;