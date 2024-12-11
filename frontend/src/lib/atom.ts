import { atom } from "recoil";

export const userAtom = atom({
	key: "userAtom",
	default: {
		username: "",
		id: "",
		role: "",
	},
});

export const teacherNameAtom = atom({
	key: "teacherNameAtom",
	default: "",
});

export const roomNameAtom = atom({
	key: "roomNameAtom",
	default: "",
});

export const roomIdAtom = atom({
	key: "roomIdAtom",
	default: "",
});
