import { getObject } from "./s3.js";
import Comment from "../models/Comment.js";

export const getPostUtil = async (post, cache = {}) => {
    if (!cache[post.author._id]) {
        cache[post.author._id] = await getProfilePicture(post.author.profilePicture);
    }
    post.author.profilePicture = cache[post.author._id];

    for (const image of post.images) {
        image.thumbnail = await getObject(image.thumbnail);
        image.large = await getObject(image.large);
    }

    for (const file of post.files) {
        file.file = await getObject(file.file);
    }

    const comments = await Comment.find({ postId: post._id });
    post.comments = comments.length;
}

export const getProfilePicture = async (profilePicture) => {
    if (!profilePicture) return;
    profilePicture.thumbnail = await getObject(profilePicture.thumbnail);
    profilePicture.large = await getObject(profilePicture.large);
    return profilePicture
}