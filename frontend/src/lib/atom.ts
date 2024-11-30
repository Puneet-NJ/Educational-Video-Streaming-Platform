import { atom } from "recoil";

export const userAtom = atom({
	key: "userAtom",
	default: {
		id: "",
		username: "",
		role: "",
	},
});

export const roomAtom = atom({
	key: "roomAtom",
	default: {
		roomName: "",
		roomId: "",
	},
});

export const participantIdAtom = atom({
	key: "participantIdAtom",
	default: "",
});

export const roomToken = atom({
	key: "roomToken",
	default: "",
});
