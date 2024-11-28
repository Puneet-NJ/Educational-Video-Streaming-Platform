import { Router } from "express";
import auth from "./middleware/auth";
import { createRoomSchema } from "./types/zod";
import { client, roomService } from "./utils/lib";
import { AccessToken } from "livekit-server-sdk";

export const roomRouter = Router();

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

		// create a room
		const opts = {
			name: roomName,
			emptyTimeout: 10 * 60,
			maxParticipants,
		};
		roomService.createRoom(opts).then((room) => {
			console.log("Room created successfully: ", room);
		});

		// create a token
		const user = new AccessToken(
			process.env.LIVEKIT_API_KEY,
			process.env.LIVEKIT_API_SECRET,
			{
				identity: username,
				ttl: "10m",
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
			res.status(500).json({ msg: "Error while updating db" });
		}

		res.json({ msg: "Room created successfully", token });
	} catch (err) {
		res.status(500).json({ msg: "Internal server error" });
	}
});
