import WebSocket from "ws";

export const ROOMS = new Map<string, ROOM_OPTIONS>();

interface ROOM_OPTIONS {
	sockets: WebSocket[];
}
