import {
	Microphone,
	MicrophoneSlash,
	ScreenShare,
	VideoCamera,
	VideoCameraSlash,
} from "@/lib/Icons";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Clipboard } from "flowbite-react";

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
	teacherRoomId: string;
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
	teacherRoomId,
}: Props) => {
	return (
		<div className="flex items-center justify-center gap-5 bg-slate-300 py-3">
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

			<Popover>
				<PopoverTrigger className="rounded-full">
					<Button variant={"default"} className="rounded-full">
						Room ID
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<div className="w-full">
						<div className="flex gap-2 items-center">
							<input
								id="roomId"
								type="text"
								className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-10 text-xs text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
								value={teacherRoomId}
								disabled
								readOnly
							/>

							<div className="relative right-10">
								<Clipboard.WithIcon valueToCopy={teacherRoomId} />
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};
