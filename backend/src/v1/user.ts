import express from "express";
import { userSigninSchema, userSignupSchema } from "./types/zod.js";
import { client } from "./utils/lib.js";
import bcrypt from "bcryptjs";
const { compare, hash } = bcrypt;
import jwt from "jsonwebtoken";
import auth from "./middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
	try {
		const validateInput = userSignupSchema.safeParse(req.body);
		if (!validateInput.success) {
			res.status(411).json({ msg: "Invalid inputs" });
			return;
		}

		const username = validateInput.data.username;
		const password = validateInput.data.password;
		const role = validateInput.data.role;

		const userExists = await client.user.findFirst({ where: { username } });
		if (userExists) {
			res.status(409).json({ msg: "Username already exists" });
			return;
		}

		const hashedPassword = await hash(password, 10);
		const user = await client.user.create({
			data: {
				username,
				password: hashedPassword,
				role,
			},
		});

		const token = jwt.sign(
			{ id: user.id, username: user.username, role: user.role },
			process.env.JWT_SECRET
		);

		res.json({ msg: "Sign up successful", token });
	} catch (err) {
		console.log(err);

		res.status(500).json({ msg: "Internal server error" });
	}
});

userRouter.post("/signin", async (req, res) => {
	try {
		const validateInput = userSigninSchema.safeParse(req.body);
		if (!validateInput.success) {
			res.status(403).json({ msg: "Invalid inputs" });
			return;
		}

		const username = validateInput.data.username;
		const password = validateInput.data.password;

		const user = await client.user.findFirst({
			where: { username },
		});
		if (!user) {
			res.status(401).json({ msg: "Username doesn't exists" });
			return;
		}

		const isPasswordMatching = await compare(password, user.password);
		if (!isPasswordMatching) {
			res.status(401).json({ msg: "Password doesn't match" });
			return;
		}

		const token = jwt.sign(
			{ id: user.id, username: user.username, role: user.role },
			process.env.JWT_SECRET
		);

		res.json({ msg: "Sign in successful", token });
	} catch (err) {
		console.log(err);

		res.status(500).json({ msg: "Internal server error" });
	}
});

userRouter.get(
	"/isPresentInRoom/:roomId",
	auth(["Admin", "Student", "Teacher"]),
	async (req, res) => {
		try {
			const roomId = req.params.roomId;
			const userId = res.locals.id;

			const response = await client.userInRoom.findFirst({
				where: {
					roomId,
					userId,
				},
			});

			if (!response) {
				res.status(403).json({ msg: "User is not part of this room" });
				return;
			}

			res.json({ msg: "User is part of room" });
		} catch (err) {
			console.log(err);

			res.status(500).json({ msg: "Internal server error" });
		}
	}
);

export { userRouter };
