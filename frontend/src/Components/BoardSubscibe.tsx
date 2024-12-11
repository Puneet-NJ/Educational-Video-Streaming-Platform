import { WS_URL } from "@/lib/lib";
import { useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useRecoilValue } from "recoil";
import { roomIdAtom } from "@/lib/atom";

const BoardSubscribe = () => {
	const wsRef = useRef<WebSocket>();
	const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();
	const roomId = useRecoilValue(roomIdAtom);

	useEffect(() => {
		wsRef.current = new WebSocket(WS_URL);

		wsRef.current.onopen = (event) => {
			if (!wsRef.current || roomId === "") return;

			console.log(roomId);

			wsRef.current.send(JSON.stringify({ type: "joinClass", roomId }));

			wsRef.current.onmessage = (event) => {
				const data = JSON.parse(event.data);
				console.log(data);

				if (data.type === "recieve-stroke") {
					console.log("update");

					excalidrawAPI?.updateScene(data.stroke);
				}
			};
		};
	}, [roomId]);

	return (
		<div className="w-full h-full">
			<Excalidraw
				initialData={{ elements: [], appState: {} }}
				excalidrawAPI={(api) => setExcalidrawAPI(api)}
				viewModeEnabled={true}
			/>
		</div>
	);
};

export default BoardSubscribe;
