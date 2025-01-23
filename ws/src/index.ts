import { WebSocketServer } from "ws";
import { ChatMetaData, CHATS, ROOMS, USER_ROOM } from "./types";
import { jwtVerify, processStroke } from "./helper";
import { v4 as uuidv4 } from "uuid";

require("dotenv").config();

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket) => {
	socket.on("message", (data) => {
		const { type, roomId } = JSON.parse(data.toString());

		if (type === "joinClass") {
			const { token, scene, stroke } = JSON.parse(data.toString());

			let username: string;
			let role: "Student" | "Teacher" | "Admin";

			const tokenVerify = jwtVerify(token);
			if (tokenVerify === "error") {
				socket.send(JSON.stringify({ type: "Invalid token" }));
				return;
			} else {
				username = tokenVerify.username;
				role = tokenVerify.role;
			}

			if (!ROOMS.has(roomId)) {
				// if not role is teacher return
				if (role !== "Teacher") {
					socket.send(
						JSON.stringify({ type: "There exists no room with this room Id" })
					);
					return;
				}

				let modifiedStroke = null;
				if (stroke) modifiedStroke = processStroke(stroke);

				ROOMS.set(roomId, {
					Room_MetaData: {
						currScene: scene || "Teacher",
						currStroke: modifiedStroke,
					},
					Sockets: new Map(),
				});

				CHATS.set(roomId, new Map());
			}

			if (ROOMS.get(roomId)!.Sockets.has(socket)) {
				socket.send(
					JSON.stringify({ type: "you are already part of this room" })
				);
				return;
			}

			ROOMS.get(roomId)!.Sockets.set(socket, {
				name: username,
				isTeacher: role === "Teacher",
			});

			USER_ROOM.set(socket, roomId);

			if (role === "Teacher") {
				socket.send(
					JSON.stringify({
						type: "joined",
						// ROOMS: ROOMS.get(roomId)?.Sockets.get(socket),
						// USER_ROOM: USER_ROOM.get(socket),
					})
				);
				return;
			}

			const chats: ChatMetaData[] = [];
			CHATS.get(roomId)?.forEach((chat) => {
				chats.push(chat);
			});

			socket.send(
				JSON.stringify({
					type: "joined",
					scene,
					stroke,
					chats: chats,
				})
			);
			return;
		}

		if (type === "leaveClass") {
			if (!ROOMS.has(roomId)) {
				socket.send(JSON.stringify({ type: "No room with this Id exists" }));
				return;
			}

			const socketMetaData = ROOMS.get(roomId)?.Sockets.get(socket);

			if (socketMetaData?.isTeacher) {
				socket.send(JSON.stringify({ type: "left" }));
				ROOMS.get(roomId)?.Sockets.forEach((value, key) => {
					if (key !== socket)
						key.send(JSON.stringify({ type: "teacher-left" }));
				});

				ROOMS.delete(roomId);
				return;
			}

			socket.send(JSON.stringify({ type: "left" }));

			ROOMS.get(roomId)?.Sockets.delete(socket);
			return;
		}

		if (type === "currScene") {
			const { scene } = JSON.parse(data.toString());

			if (!ROOMS.has(roomId)) {
				socket.send(JSON.stringify({ type: "No room with this Id exists" }));
				return;
			}

			const socketMetaData = ROOMS.get(roomId)?.Sockets.get(socket);

			if (!socketMetaData) {
				socket.send(JSON.stringify({ type: "You are not part of the room" }));
				return;
			}

			if (!socketMetaData.isTeacher) {
				socket.send(JSON.stringify({ type: "You are not the teacher" }));
				return;
			}

			ROOMS.get(roomId)!.Room_MetaData.currScene = scene;

			ROOMS.get(roomId)!.Sockets.forEach((value, key) => {
				if (key !== socket)
					key.send(JSON.stringify({ type: "currScene", scene: scene }));
			});
			return;
		}

		if (type === "sendStroke") {
			const { stroke } = JSON.parse(data.toString());

			if (!ROOMS.has(roomId)) {
				socket.send(JSON.stringify({ type: "No room with this Id exists" }));
				return;
			}

			const modifiedStroke = processStroke(stroke);

			ROOMS.get(roomId)!.Room_MetaData.currStroke = modifiedStroke;

			ROOMS.get(roomId)!.Sockets.forEach((value, key) => {
				if (key !== socket)
					key.send(
						JSON.stringify({ type: "recieve-stroke", stroke: modifiedStroke })
					);
			});
			return;
		}

		// Chats
		if (type === "sendChat") {
			const { chat } = JSON.parse(data.toString());

			if (!ROOMS.get(roomId)) {
				socket.send(JSON.stringify({ type: "No room with this Id exists" }));
				return;
			}

			const socketMetaData = ROOMS.get(roomId)?.Sockets.get(socket);
			if (!socketMetaData) {
				socket.send(JSON.stringify({ type: "You are not part of the room" }));
				return;
			}

			CHATS.get(roomId)?.set(uuidv4(), {
				name: socketMetaData.name,
				text: chat,
				time: new Date(),
			});

			const chats = CHATS.get(roomId);

			const chatsArray: { [key: string]: ChatMetaData }[] = [];

			if (chats) {
				Array.from(chats).forEach(([key, chatData]) => {
					chatsArray.push({ [key]: chatData });
				});
			}

			ROOMS.get(roomId)?.Sockets.forEach((value, key) => {
				key.send(
					JSON.stringify({ type: "recieve-chat", chats: [...chatsArray] })
				);
			});
		}
	});

	socket.on("close", () => {
		const roomId = USER_ROOM.get(socket) || "";

		if (!ROOMS.has(roomId)) {
			socket.send(JSON.stringify({ type: "No room with this Id exists" }));
			return;
		}

		const socketMetaData = ROOMS.get(roomId)?.Sockets.get(socket);

		if (socketMetaData?.isTeacher) {
			ROOMS.delete(roomId);

			socket.send(JSON.stringify({ type: "left" }));
			ROOMS.get(roomId)?.Sockets.forEach((value, key) => {
				if (key !== socket) key.send(JSON.stringify({ type: "teacher-left" }));
			});

			return;
		}

		ROOMS.get(roomId)?.Sockets.delete(socket);

		socket.send(JSON.stringify({ type: "left" }));
		return;
	});

	socket.on("error", (err) => {
		console.log(err);
	});
});
