import useHostComp from "@/Hooks/useHostComp";
import { Excalidraw } from "@excalidraw/excalidraw";

const BoardPublish = () => {
	const { handleBoardChange } = useHostComp();

	return (
		<div className="w-full h-full">
			<Excalidraw onChange={handleBoardChange} />
		</div>
	);
};

export default BoardPublish;
