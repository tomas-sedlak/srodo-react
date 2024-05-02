import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import sharp from "sharp";

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_ACCESS_SECRET,
    },
    region: process.env.BUCKET_REGION,
})

export const uploadImage = async (image, width, height) => {
    if (!image) return

    const imageName = crypto.randomBytes(32).toString("hex");
    const buffer = await sharp(image.buffer).resize(width, height).toBuffer();
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
        Body: buffer,
        ContentType: image.mimetype,
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