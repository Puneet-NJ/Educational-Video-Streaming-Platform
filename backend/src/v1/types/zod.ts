import zod from "zod";

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
	canParticipantsPublish: zod.boolean(),
});
