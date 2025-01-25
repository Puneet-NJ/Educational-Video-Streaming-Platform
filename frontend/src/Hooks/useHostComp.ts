import { chatsAtom, currSceneAtom, currSlideAtom } from "@/lib/atom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import useToken from "./useToken";
import { roomIdAtom } from "@/lib/atom";

import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";

type Slides = {
	currSlide: number | null;
};
type SceneType = "Teacher" | "Screen Share" | "White Board" | Slides;

const useHostComp = () => {
	const [chatInput, setChatInput] = useState("");
	const [excalidStroke, setExcaliStroke] = useState<any>();

	const wsRef = useRef<WebSocket | null>(null);
	const wsUrl = "ws://localhost:8080/";

	const setChatsAtom = useSetRecoilState(chatsAtom);
	const roomId = useRecoilValue(roomIdAtom);
	const currSlide = useRecoilValue(currSlideAtom);
	const [currScene, setCurrScene] = useRecoilState(currSceneAtom);

	const token = useToken();

	useEffect(() => {
		wsRef.current = new WebSocket(wsUrl);

		wsRef.current.onopen = (ev) => {
			let sceneType: SceneType;

			if (currScene.board) {
				sceneType = "White Board";
			} else if (currScene.screen) {
				sceneType = "Screen Share";
			} else if (currScene.slides) {
				sceneType = {
					currSlide,
				};
			} else {
				sceneType = "Teacher";
			}

			wsRef.current?.send(
				JSON.stringify({
					type: "joinClass",
					token: token.getToken(),
					stroke: excalidStroke,
					scene: sceneType,
				})
			);
		};

		wsRef.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log(data);

			if (data.type === "recieve-chat") {
				const { chats } = data;

				setChatsAtom(chats.reverse());
			}
		};
	}, []);

	const handleSendChat = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (chatInput === "") return;

		console.log(chatInput + " " + wsRef.current?.OPEN);

		wsRef.current?.send(JSON.stringify({ type: "sendChat", chat: chatInput }));

		setChatInput("");
	};

	const handleBoardChange = (
		elements: readonly ExcalidrawElement[],
		appState: AppState,
		files: BinaryFiles
	) => {
		if (!wsRef.current) return;

		// setExcaliStroke({ elements, appState });

		if (wsRef.current?.readyState === 1)
			wsRef.current?.send(
				JSON.stringify({
					type: "sendStroke",
					stroke: { elements, appState },
					roomId,
				})
			);
	};

	const handleChangeScene = useCallback(
		(
			activeScene: "slides" | "board" | "default" | "screen",
			slide?: number
		) => {
			console.log(slide);

			setCurrScene({
				slides: activeScene === "slides",
				board: activeScene === "board",
				default: activeScene === "default",
				screen: activeScene === "screen",
			});

			let scene: SceneType;
			if (activeScene === "slides") {
				if (slide !== null && slide !== undefined) {
					scene = {
						currSlide: slide,
					};
				} else {
					scene = {
						currSlide,
					};
				}
			} else if (activeScene === "board") {
				scene = "White Board";
			} else if (activeScene === "screen") {
				scene = "Screen Share";
			} else {
				scene = "Teacher";
			}

			console.log(wsRef.current?.readyState);

			if (wsRef.current?.readyState === 1) {
				wsRef.current.send(
					JSON.stringify({ type: "currScene", roomId, scene: scene })
				);
			}
		},
		[wsRef.current, setCurrScene]
	);

	return {
		chatInput,
		setChatInput,
		handleSendChat,
		handleBoardChange,
		handleChangeScene,
	};
};

export default useHostComp;
