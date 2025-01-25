import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";

const BoardPublish = ({
	handleBoardChange,
}: {
	handleBoardChange: (
		elements: readonly ExcalidrawElement[],
		appState: AppState,
		files: BinaryFiles
	) => void;
}) => {
	return (
		<div className="w-full h-full">
			<Excalidraw onChange={handleBoardChange} />
		</div>
	);
};

export default BoardPublish;
