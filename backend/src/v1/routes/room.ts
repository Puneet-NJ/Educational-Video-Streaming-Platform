import express from "express";
import auth from "../middlewares/auth.js";
import {
	createRoomSchema,
	joinRoomSchema,
	leaveRoomSchema,
} from "../types/zod.js";
import { client, roomService } from "../utils/lib.js";
import { v4 as uuidv4 } from "uuid";
import { createLivekitToken } from "../utils/createLivekitToken.js";

const roomRouter = express.Router();

// todo: In create room and create token check if the user is already part of a room and return if they are
roomRouter.post("/", auth(["Teacher", "Admin"]), async (req, res) => {
	try {
		const validateInput = createRoomSchema.safeParse(req.body);
		if (!validateInput.success) {
			res.status(411).json({ msg: "Invalid inputs" });
			return;
		}

		const roomName = validateInput.data.roomName;
		const description = validateInput.data.description;
		const maxParticipants = validateInput.data.maxParticipants;
		const teacherId = res.locals.id;
		const username = res.locals.username;
		const role = res.locals.role;

		// const user = await client.user.findFirst({
		// 	where: {
		// 		id: teacherId,
		// 	},
		// });
		// if (user?.isPartOfRoom) {
		// 	res.status(411).json({ msg: "You are already in a room" });
		// 	return;
		// }

		const roomId = uuidv4();

		// create a room
		const opts = {
			name: roomId,
			emptyTimeout: 1 * 60,
			maxParticipants,
		};
		const createdRoom = await roomService.createRoom(opts);

		// put the room details and room permissions info in the db
		try {
			await client.room.create({
				data: {
					id: roomId,
					name: roomName,
					description,
					maxParticipants,
					teacherId,
				},
			});
		} catch (err) {
			console.log(err);

			await roomService.deleteRoom(roomId).then(() => {
				console.log("deleted the room");
			});

			res.status(500).json({ msg: "Error while updating db" });
			return;
		}

		const token = await createLivekitToken(
			role,
			teacherId,
			teacherId,
			username,
			roomId
		);

		res.json({ msg: "Room created successfully", roomId, token });
	} catch (err) {
		console.log(err);

		res.status(500).json({ msg: "Internal server error" });
	}
});

roomRouter.post(
	"/token",
	auth(["Teacher", "Admin", "Student"]),
	async (req, res) => {
		try {
			const validateInput = joinRoomSchema.safeParse(req.body);
			if (!validateInput.success) {
				res.status(411).json({ msg: "Invalid inputs" });
				return;
			}

			const roomId = validateInput.data.roomId;
			const userId = res.locals.id;
			const username = res.locals.username;
			const role = res.locals.role;

			// todo: check if user is already part of the room and return if so
			// const user = await client.user.findFirst({
			// 	where: {
			// 		id: userId,
			// 	},
			// });
			// if (user?.isPartOfRoom) {
			// 	res.json({ msg: "You are already part of a room" });
			// 	return;
			// }

			const roomInfo = await client.room.findFirst({
				where: { id: roomId },
				select: {
					teacher: { select: { username: true } },
					name: true,
					maxParticipants: true,
					teacherId: true,
				},
			});
			if (!roomInfo) {
				res.status(400).json({ msg: "Room doesn't exist" });
				return;
			}

			const currParticipantsInRoom = await roomService.listParticipants(roomId);

			if (currParticipantsInRoom.length >= roomInfo.maxParticipants) {
				res.status(400).json({ msg: "The room is full" });
				return;
			}

			const token = await createLivekitToken(
				role,
				userId,
				roomInfo.teacherId,
				username,
				roomId
			);

			res.json({
				msg: "Token generated successfully",
				token,
				teacher: roomInfo.teacher.username,
				roomName: roomInfo.name,
			});
		} catch (err) {
			console.log(err);

			res.status(500).json({ msg: "Internal server error" });
		}
	}
);

roomRouter.post(
	"/join/:roomId",
	auth(["Teacher", "Admin", "Student"]),
	async (req, res) => {
		try {
			const userId = res.locals.id;
			const roomId = req.params.roomId;

			if (!roomId || roomId === "") {
				res.status(411).json({ msg: "Room Id not provided" });
				return;
			}

			const joinUser = await client.userInRoom.create({
				data: {
					userId,
					roomId,
					isPartOfRoom: true,
				},
			});

			res.json({ msg: "User joined the room", id: joinUser.id });
		} catch (err) {
			console.log(err);

			res.status(500).json({ msg: "Internal server error" });
		}
	}
);

roomRouter.post(
	"/leave/:participationId",
	auth(["Teacher", "Admin", "Student"]),
	async (req, res) => {
		try {
			const userId = res.locals.id;
			const participationId = req.params.participationId;

			const leftUser = await client.userInRoom.update({
				where: { id: participationId },
				data: { leftAt: new Date(), isPartOfRoom: false },
			});

			res.json({ msg: "User left the room" });
		} catch (err) {
			console.log(err);

			res.status(500).json({ msg: "Internal server error" });
		}
	}
);

export { roomRouter };
