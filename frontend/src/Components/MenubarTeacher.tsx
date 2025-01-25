import {
	Microphone,
	MicrophoneSlash,
	ScreenShare,
	VideoCamera,
	VideoCameraSlash,
} from "@/lib/Icons";
import { Button } from "./ui/button";
import { useSetRecoilState } from "recoil";
import { currSceneAtom } from "@/lib/atom";

type Props = {
	publishAudio: boolean;
	publishVideo: boolean;
	publishScreen: boolean;
	handleCameraToggle: () => void;
	handleMicrophoneToggle: () => void;
	handleShareScreenToggle: () => void;
	handleLeaveRoom: () => void;
	handleChangeScene: (
		activeScene: "slides" | "board" | "default" | "screen",
		slide?: number
	) => void;
};

export const MenubarTeacher = ({
	publishAudio,
	publishVideo,
	publishScreen,
	handleCameraToggle,
	handleMicrophoneToggle,
	handleShareScreenToggle,
	handleLeaveRoom,
	handleChangeScene,
}: Props) => {
	const setCurrScene = useSetRecoilState(currSceneAtom);

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

					handleChangeScene("screen");
				}}
				variant={!publishScreen ? "destructive" : "outline"}
				className="rounded-full"
			>
				<ScreenShare />
			</Button>

			<Button
				variant={"outline"}
				className="rounded-full"
				onClick={() => handleChangeScene("slides")}
			>
				Slides
			</Button>

			<Button
				variant={"outline"}
				className="rounded-full"
				onClick={() => handleChangeScene("board")}
			>
				White Board
			</Button>

			<Button
				variant={"outline"}
				className="rounded-full"
				onClick={() => handleChangeScene("default")}
			>
				Default
			</Button>

			<Button
				variant={"destructive"}
				className="rounded-full"
				onClick={handleLeaveRoom}
			>
				Leave Room
			</Button>
		</div>
	);
};
