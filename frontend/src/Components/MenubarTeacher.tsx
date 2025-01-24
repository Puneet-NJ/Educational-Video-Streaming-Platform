import {
	Microphone,
	MicrophoneSlash,
	ScreenShare,
	VideoCamera,
	VideoCameraSlash,
} from "@/lib/Icons";
import { Button } from "./ui/button";

type Props = {
	publishAudio: boolean;
	publishVideo: boolean;
	publishScreen: boolean;
	handleCameraToggle: () => void;
	handleMicrophoneToggle: () => void;
	handleShareScreenToggle: () => void;
	setCurrScene: React.Dispatch<
		React.SetStateAction<{
			board: boolean;
			slides: boolean;
			default: boolean;
			screen: boolean;
		}>
	>;
};

export const MenubarTeacher = ({
	publishAudio,
	publishVideo,
	publishScreen,
	handleCameraToggle,
	handleMicrophoneToggle,
	handleShareScreenToggle,
	setCurrScene,
}: Props) => {
	return (
		<div className="flex items-center justify-center gap-5 bg-slate-200 py-3">
			<Button
				onClick={handleCameraToggle}
				variant={!publishVideo ? "destructive" : "outline"}
				className="rounded-full"
			>
				{!publishVideo ? <VideoCameraSlash /> : <VideoCamera />}
			</Button>

			<Button
				onClick={handleMicrophoneToggle}
				variant={!publishAudio ? "destructive" : "outline"}
				className="rounded-full"
			>
				{!publishAudio ? <MicrophoneSlash /> : <Microphone />}
			</Button>

			<Button
				onClick={() => {
					handleShareScreenToggle();

					setCurrScene({
						slides: false,
						board: false,
						default: false,
						screen: true,
					});
				}}
				variant={!publishScreen ? "destructive" : "outline"}
				className="rounded-full"
			>
				<ScreenShare />
			</Button>

			<Button
				variant={"outline"}
				className="rounded-full"
				onClick={() =>
					setCurrScene({
						slides: true,
						board: false,
						default: false,
						screen: false,
					})
				}
			>
				Slides
			</Button>

			<Button
				variant={"outline"}
				className="rounded-full"
				onClick={() =>
					setCurrScene({
						slides: false,
						board: true,
						default: false,
						screen: false,
					})
				}
			>
				White Board
			</Button>

			<Button
				variant={"outline"}
				className="rounded-full"
				onClick={() =>
					setCurrScene({
						slides: false,
						board: false,
						default: true,
						screen: false,
					})
				}
			>
				Default
			</Button>
		</div>
	);
};
