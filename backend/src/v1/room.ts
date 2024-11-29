import express from "express";
import auth from "./middleware/auth.js";
import { createRoomSchema } from "./types/zod.js";
import { client, roomService } from "./utils/lib.js";
import { AccessToken } from "livekit-server-sdk";

const roomRouter = express.Router();

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
		const canParticipantsPublish = validateInput.data.canParticipantsPublish;
		const teacherId = res.locals.id;
		const username = res.locals.username;

		const room = await client.room.findFirst({
			where: {
				name: roomName,
			},
		});
		if (room) {
			res.status(409).json({ msg: "Room name already exists" });
			return;
		}

		const usersRoom = await client.userInRoom.findMany({
			where: {
				userId: teacherId,
			},
		});
		usersRoom.map((room) => {
			if (room.isUserActive) {
				res.status(411).json({ msg: "You are already in a room" });
				return;
			}
		});

		// create a room
		const opts = {
			name: roomName,
			emptyTimeout: 1 * 60,
			maxParticipants,
		};
		const createdRoom = await roomService.createRoom(opts);
		console.log(createdRoom);

		// create a token
		const user = new AccessToken(
			process.env.LIVEKIT_API_KEY,
			process.env.LIVEKIT_API_SECRET,
			{
				identity: username,
				ttl: "1m",
			}
		);
		user.addGrant({ roomAdmin: true, roomJoin: true, room: roomName });
		const token = await user.toJwt();

		// put the room details and room permissions info in the db
		try {
			await client.$transaction(async (txn) => {
				const room = await client.room.create({
					data: {
						name: roomName,
						description,
						maxParticipants,
						teacherId,
					},
				});

				await client.roomPermissions.create({
					data: {
						canPublish: canParticipantsPublish,
						roomId: room.id,
					},
				});
			});
		} catch (err) {
			await roomService
				.deleteRoom(roomName)
				.then(() => {
					console.log("deleted the room");
				})
				.catch((err) => console.log(err));

			res.status(500).json({ msg: "Error while updating db" });
			return;
		}

		res.json({ msg: "Room created successfully", token });
	} catch (err) {
		console.log(err);

		res.status(500).json({ msg: "Internal server error" });
	}
});

export { roomRouter };
