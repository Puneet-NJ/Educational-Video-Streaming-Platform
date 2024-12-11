import BoardSubscribe from "@/Components/BoardSubscibe";
import { Video } from "@/Components/Video";

const Space = () => {
	return (
		<div className="grid grid-cols-4">
			<div className="col-span-3">
				<BoardSubscribe />
			</div>

			<div className="col-span-1">
				<Video />
			</div>
		</div>
	);
};

export default Space;
