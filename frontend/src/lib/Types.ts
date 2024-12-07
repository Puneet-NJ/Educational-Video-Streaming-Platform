import { z } from "zod";

export const signupFormSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	password: z.string().min(6, {
		message: "Password must be at least 2 characters.",
	}),
	role: z.enum(["Student", "Teacher", "Admin"]),
});

export const signinFormSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	password: z.string().min(6, {
		message: "Password must be at least 2 characters.",
	}),
});

export const createRoomSchema = z.object({
	roomName: z.string().min(2, {
		message: "Room name must be at least 2 characters.",
	}),
	description: z.string().min(2, {
		message: "Room Description must be at least 2 characters.",
	}),
	maxParticipants: z.coerce.number().min(2),
});

export const joinRoomSchema = z.object({
	roomId: z.string(),
});

export const createTokenSchema = z.object({
	roomId: z.string(),
});
