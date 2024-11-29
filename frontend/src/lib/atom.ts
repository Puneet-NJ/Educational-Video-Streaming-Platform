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
		token: "",
		roomName: "",
	},
});
