import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { generateToken } from "./utils.js";
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

    const imageName = generateToken();

    let body;
    if (isValidUrl(image)) {
        const response = await axios.get(image, { responseType: "arraybuffer" });
        body = await sharp(response.data)
            .withMetadata({ orientation: null })
            .resize(width, height)
            .jpeg({ quality: 100 })
            .toBuffer();
    } else {
        body = await sharp(image.buffer)
            .withMetadata({ orientation: null })
            .resize(width, height)
            .jpeg({ quality: 100 })
            .toBuffer();
    }

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
        Body: body,
        ContentType: image.mimetype || "image/jpeg",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${imageName}`;
}

export const uploadFile = async (file) => {
    if (!file) return

    const fileName = generateToken();
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`;
}

export const deleteObject = async (object) => {
    if (!object) return

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: object,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);
}