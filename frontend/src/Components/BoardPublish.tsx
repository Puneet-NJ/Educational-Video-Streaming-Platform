import { useEffect, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { WS_URL } from "@/lib/lib";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { useRecoilValue } from "recoil";
import { roomIdAtom } from "@/lib/atom";

const BoardPublish = () => {
	const wsRef = useRef<WebSocket>();
	const roomId = useRecoilValue(roomIdAtom);

	useEffect(() => {
		wsRef.current = new WebSocket(WS_URL);

		wsRef.current.onopen = (event) => {
			if (!wsRef.current || roomId === "") return;

			console.log(roomId);

			wsRef.current.send(JSON.stringify({ type: "joinClass", roomId }));
		};
	}, [roomId]);

	const handleChange = (
		elements: readonly ExcalidrawElement[],
		appState: AppState,
		files: BinaryFiles
	) => {
		console.log(elements, appState);

		if (!wsRef.current) return;

		console.log(wsRef.current?.OPEN);

		if (wsRef.current?.readyState === 1)
			wsRef.current?.send(
				JSON.stringify({
					type: "sendStroke",
					stroke: { elements, appState },
					roomId,
				})
			);
	};

	return (
		<div className="w-full h-full">
			<Excalidraw onChange={handleChange} />
		</div>
	);
};

export default BoardPublish;
