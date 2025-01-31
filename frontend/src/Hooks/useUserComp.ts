import { useEffect, useRef, useState } from "react";
import useToken from "./useToken";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
	chatsAtom,
	currSceneAtom,
	currSlideAtom,
	excalidrawAtom,
	roomIdAtom,
} from "@/lib/atom";

const useUserComp = () => {
	const [chatInput, setChatInput] = useState("");

	const wsRef = useRef<WebSocket | null>(null);
	const wsUrl = "ws://localhost:8080/";

	const setCurrScene = useSetRecoilState(currSceneAtom);
	const excalidrawAPI = useRecoilValue(excalidrawAtom);
	const roomId = useRecoilValue(roomIdAtom);
	const setCurrSlide = useSetRecoilState(currSlideAtom);
	const setChatsAtom = useSetRecoilState(chatsAtom);

	const { getToken } = useToken();

	const handleParseScene = (scene: any) => {
		if (scene === "White Board") {
			setCurrScene({
				board: true,
				default: false,
				screen: false,
				slides: false,
			});
		} else if (scene === "Screen Share") {
			setCurrScene({
				board: false,
				default: false,
				screen: true,
				slides: false,
			});
		} else if (scene === "Teacher") {
			setCurrScene({
				board: false,
				default: true,
				screen: false,
				slides: false,
			});
		} else {
			setCurrScene({
				board: false,
				default: false,
				screen: false,
				slides: true,
			});

			setCurrSlide(scene.currSlide);
		}
	};

	useEffect(() => {
		wsRef.current = new WebSocket(wsUrl);

		wsRef.current.onopen = (event) => {
			if (!roomId) return;

			if (wsRef.current?.readyState === 1)
				wsRef.current?.send(
					JSON.stringify({
						type: "joinClass",
						token: getToken(),
						roomId: roomId,
					})
				);
		};

		wsRef.current.onmessage = (event) => {
			const { type } = JSON.parse(event.data);

			if (type === "joined") {
				const { scene, stroke, chats } = JSON.parse(event.data);

				if (scene) handleParseScene(scene);

				if (excalidrawAPI && stroke) excalidrawAPI.updateScene(stroke);

				if (chats) setChatsAtom(chats.reverse());
			} else if (type === "currScene") {
				const { scene } = JSON.parse(event.data);

				handleParseScene(scene);
			} else if (type === "recieve-stroke") {
				const { stroke } = JSON.parse(event.data);

				if (excalidrawAPI) excalidrawAPI.updateScene(stroke);
			} else if (type === "recieve-chat") {
				const { chats } = JSON.parse(event.data);

				setChatsAtom(chats.reverse());
			}
		};

		return () => {
			wsRef.current = null;
		};
	}, [roomId, excalidrawAPI]);

	const handleSendChat = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (chatInput === "") return;

		if (!roomId) return;

		wsRef.current?.send(
			JSON.stringify({ type: "sendChat", chat: chatInput, roomId: roomId })
		);

		setChatInput("");
	};

	return {
		chatInput,
		setChatInput,
		handleSendChat,
	};
};

export default useUserComp;
