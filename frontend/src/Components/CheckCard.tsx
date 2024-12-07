import useCheckCard from "@/Hooks/useCheckCard";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export const CheckCard = () => {
	const { tracksRef, handleCameraToggle, handleMicToggle, handleJoinRoom } =
		useCheckCard();

	return (
		<Card className="p-10 shadow-2xl dark:bg-inherit bg-gray-300 flex flex-col gap-7">
			<div className="w-80">
				<video className="max-w-full" ref={tracksRef} autoPlay playsInline />
			</div>

			<div className="flex flex-col gap-7">
				<div className="flex justify-center gap-7">
					<Button onClick={handleCameraToggle}>Camera</Button>
					<Button onClick={handleMicToggle}>Microphone</Button>
				</div>

				<div className="flex justify-center">
					<Button
						onClick={handleJoinRoom}
						variant="secondary"
						className="bg-green-500 text-white"
					>
						Join
					</Button>
				</div>
			</div>
		</Card>
	);
};
