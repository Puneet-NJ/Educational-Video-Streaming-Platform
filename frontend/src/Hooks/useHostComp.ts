import { useState } from "react";

const useHostComp = () => {
	const [currScene, setCurrScene] = useState({
		board: false,
		slides: false,
		screen: false,
		default: true,
	});

	return { currScene, setCurrScene };
};

export default useHostComp;
