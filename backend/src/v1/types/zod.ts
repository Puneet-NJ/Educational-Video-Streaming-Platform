import zod from "zod";
import { maxPdfSize } from "../utils/lib.js";

export const userSignupSchema = zod.object({
	username: zod.string(),
	password: zod.string(),
	role: zod.enum(["Student", "Teacher", "Admin"]),
});

export const userSigninSchema = zod.object({
	username: zod.string(),
	password: zod.string(),
});

export const createRoomSchema = zod.object({
	roomName: zod.string(),
	description: zod.string(),
	maxParticipants: zod.number(),
});

export const joinRoomSchema = zod.object({
	roomId: zod.string(),
});

export const leaveRoomSchema = zod.object({
	participationId: zod.string(),
});

export const slidesValidation = zod.object({
	mimetype: zod.string().refine((type) => type === "application/pdf", {
		message: "Invalid document file type, only PDF is allowed",
	}),
	size: zod.number().refine((size) => size <= maxPdfSize, {
		message: "File size should not exceed 5MB",
	}),
});
