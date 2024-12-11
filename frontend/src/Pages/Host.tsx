import BoardPublish from "@/Components/BoardPublish";
import { Video } from "@/Components/Video";

const Host = () => {
	return (
		<div className="grid grid-cols-4">
			<div className="col-span-3">
				<BoardPublish />
			</div>

			<div className="col-span-1">
				<Video />
			</div>
		</div>
	);
};

export default Host;
