import { atom } from "recoil";

export const userAtom = atom({
	key: "userAtom",
	default: {
		username: "",
		id: "",
		role: "",
	},
});
