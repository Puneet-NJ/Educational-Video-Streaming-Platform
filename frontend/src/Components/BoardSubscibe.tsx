import { Excalidraw } from "@excalidraw/excalidraw";
import { useSetRecoilState } from "recoil";
import { excalidrawAtom } from "@/lib/atom";

const BoardSubscribe = () => {
	const setExcalidrawAPI = useSetRecoilState(excalidrawAtom);

	console.log("Inside excalidraw api comp");

	return (
		<div className="w-full h-full">
			<Excalidraw
				initialData={{ elements: [], appState: {} }}
				excalidrawAPI={(api) => {
					console.log(api);

					setExcalidrawAPI(api);
				}}
				viewModeEnabled={true}
			/>
		</div>
	);
};

export default BoardSubscribe;
