import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import sharp from "sharp";
import axios from "axios";

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_ACCESS_SECRET,
    },
    region: process.env.BUCKET_REGION,
})

const isValidUrl = urlString => {
    try {
        return Boolean(new URL(urlString));
    }
    catch (e) {
        return false;
    }
}

export const uploadImage = async (image, width, height) => {
    if (!image) return

    const imageName = crypto.randomBytes(32).toString("hex");

    let body;
    if (isValidUrl(image)) {
        const response = await axios.get(image, { responseType: "arraybuffer" });
        body = Buffer.from(response.data);
    } else {
        body = await sharp(image.buffer).resize(width, height).toBuffer();
    }

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
        Body: body,
        ContentType: image.mimetype || "image/jpeg",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return imageName;
}

export const getImage = async (imageName) => {
    if (!imageName) return

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return url;
}

export const deleteImage = async (imageName) => {
    if (!imageName) return

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);
}