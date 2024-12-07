import { PrismaClient } from "@prisma/client";
import { RoomServiceClient } from "livekit-server-sdk";

export const client = new PrismaClient();

export const roomService = new RoomServiceClient(
	process.env.LIVEKIT_URL,
	process.env.LIVEKIT_API_KEY,
	process.env.LIVEKIT_API_SECRET
);
