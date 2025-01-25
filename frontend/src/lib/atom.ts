import { atom } from "recoil";
import { queryClient } from "./Providers";

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

export const slidesLinksAtom = atom({
	key: "slidesLinksAtom",
	default: (queryClient.getQueryData(["slides"]) as []) || [],
});

export const userInRoomIdAtom = atom({
	key: "userInRoomIdAtom",
	default: "",
});

export const chatsAtom = atom<
	{
		[key: string]: {
			name: string;
			text: string;
			time: Date;
		};
	}[]
>({
	key: "chatsAtom",
	default: [],
});

export const currSlideAtom = atom<number | null>({
	key: "currSlideAtom",
	default: null,
});

export const currSceneAtom = atom<{
	board: boolean;
	slides: boolean;
	screen: boolean;
	default: boolean;
}>({
	key: "currSceneAtom",
	default: {
		board: false,
		slides: false,
		screen: false,
		default: true,
	},
});
