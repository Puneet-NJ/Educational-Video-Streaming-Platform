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
	const excaliDebouceRef = useRef<NodeJS.Timeout | null>(null);

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

			if (!roomId) return;

			wsRef.current?.send(
				JSON.stringify({
					type: "joinClass",
					roomId: roomId,
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
	}, [roomId]);

	const handleSendChat = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (chatInput === "") return;

		console.log(chatInput + " " + wsRef.current?.OPEN);
		console.log("roomId ", roomId);

		if (!roomId) return;

		wsRef.current?.send(
			JSON.stringify({ type: "sendChat", chat: chatInput, roomId })
		);

		setChatInput("");
	};

	const handleBoardChange = useCallback(
		(
			elements: readonly ExcalidrawElement[],
			appState: AppState,
			files: BinaryFiles
		) => {
			if (!wsRef.current) return;

			if (excaliDebouceRef.current) clearTimeout(excaliDebouceRef.current);

			excaliDebouceRef.current = setTimeout(() => {
				setExcaliStroke({ elements, appState });

				if (wsRef.current?.readyState === 1)
					wsRef.current?.send(
						JSON.stringify({
							type: "sendStroke",
							stroke: { elements, appState },
							roomId,
						})
					);
			}, 1 * 100);
		},
		[excaliDebouceRef, setExcaliStroke, wsRef]
	);

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

			console.log(roomId);

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
