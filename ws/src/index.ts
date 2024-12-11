import { WebSocketServer } from "ws";
import { ROOMS } from "./types";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket) => {
	socket.on("message", (data) => {
		const { type, roomId } = JSON.parse(data.toString());

		if (type === "joinClass") {
			if (!ROOMS.has(roomId)) {
				ROOMS.set(roomId, { sockets: [] });
			}
			ROOMS.get(roomId)?.sockets.push(socket);

			socket.send(JSON.stringify({ type: "joined" }));
		}

		if (type === "sendStroke") {
			const { stroke } = JSON.parse(data.toString());

			const dummyAppState = { ...stroke.appState };
			dummyAppState.collaborators = [];
			dummyAppState.viewModeEnabled = true;

			const dummyStroke = {
				elements: stroke.elements,
				appState: dummyAppState,
			};

			if (!ROOMS.has(roomId)) return;

			ROOMS.get(roomId)?.sockets.map((individualSocket) => {
				if (individualSocket !== socket)
					individualSocket.send(
						JSON.stringify({ type: "recieve-stroke", stroke: dummyStroke })
					);
			});
		}
	});

	socket.on("close", () => {
		ROOMS.forEach((room) => {
			room.sockets.map((individualSocket, index) => {
				if (individualSocket === socket) room.sockets.splice(index, 1);
			});
		});
	});
});
