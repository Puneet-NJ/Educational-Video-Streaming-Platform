import { PrismaClient } from "@prisma/client";
import { RoomServiceClient } from "livekit-server-sdk";
import AWS from "aws-sdk";

let s3: AWS.S3;

export const client = new PrismaClient();

export const roomService = new RoomServiceClient(
	process.env.LIVEKIT_URL,
	process.env.LIVEKIT_API_KEY,
	process.env.LIVEKIT_API_SECRET
);

export const maxPdfSize = 5 * 1000000;

export const s3Init = () => {
	if (s3 instanceof AWS.S3) return s3;

	s3 = new AWS.S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	});

	return s3;
};
