import WebSocket from "ws";

// Rooms Schema
type Slides = {
	currSlide: number;
};

type CurrScene = "Teacher" | "Screen Share" | "White Board" | Slides;

type Socket_MetaData = {
	name: string;
	isTeacher: boolean;
};

type Sockets = Map<WebSocket, Socket_MetaData>;

interface Rooms {
	Room_MetaData: {
		currScene: CurrScene;
		currStroke: any;
	};
	Sockets: Sockets;
}

export const ROOMS = new Map<string, Rooms>();

// Chats Schema
type ChatMetaData = {
	name: string;
	text: string;
	time: Date;
};

type Room_Chats = Map<string, ChatMetaData>;

export const CHATS = new Map<string, Room_Chats>();

// User-Rooms Schema
export const USER_ROOM = new Map<WebSocket, string>();
