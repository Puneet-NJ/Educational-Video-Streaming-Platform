import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";

const BoardPublish = ({
	className,
	handleBoardChange,
}: {
	className: string;
	handleBoardChange: (
		elements: readonly ExcalidrawElement[],
		appState: AppState,
		files: BinaryFiles
	) => void;
}) => {
	return (
		<div className={"w-full h-full" + className}>
			<Excalidraw onChange={handleBoardChange} />
		</div>
	);
};

export default BoardPublish;
