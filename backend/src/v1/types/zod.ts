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
