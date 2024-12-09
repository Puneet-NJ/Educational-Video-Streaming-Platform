import { Role } from "@prisma/client";
import { AccessToken } from "livekit-server-sdk";

export const createLivekitToken = async (
	role: Role,
	userId: string,
	teacherId: string,
	username: string,
	roomId: string
) => {
	let canPublish: boolean;
	let roomAdmin: boolean;

	canPublish = false;
	roomAdmin = false;
	if (role === "Admin" || role === "Teacher") {
		if (userId === teacherId) {
			canPublish = true;
			roomAdmin = true;
		}
	}

	// create a token
	const participant = new AccessToken(
		process.env.LIVEKIT_API_KEY,
		process.env.LIVEKIT_API_SECRET,
		{
			identity: username,
			ttl: "1m",
		}
	);
	participant.addGrant({
		roomAdmin: roomAdmin,
		canPublish: canPublish,
		roomJoin: true,
		room: roomId,
	});

	const token = await participant.toJwt();

	return token;
};
