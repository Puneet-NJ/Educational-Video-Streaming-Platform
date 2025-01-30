import useUserComp from "@/Hooks/useUserComp";
import useDummyVideo from "../Hooks/useDummyVideo";
import { useRecoilValue } from "recoil";
import { chatsAtom, currSceneAtom, teacherNameAtom } from "@/lib/atom";
import { VideoComp } from "./VideoComp";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SendButton } from "@/lib/Icons";
import BoardSubscribe from "./BoardSubscibe";
import { SlidesStudent } from "./SlidesStudent";

export const UserComp = () => {
	const { videoRef, audioRef, screenRef, handleLeaveRoom } = useDummyVideo();
	const { handleSendChat, chatInput, setChatInput } = useUserComp();

	const chats = useRecoilValue(chatsAtom);
	const teacherName = useRecoilValue(teacherNameAtom);
	const currScene = useRecoilValue(currSceneAtom);

	let main = "col-span-3 row-span-8";
	let sec = "col-span-1 row-span-2";
	let chat = "col-span-1 row-span-6";
	if (currScene.default) {
		main = "hidden";
		sec = "col-span-3 row-span-8";
		chat = "col-span-1 row-span-8";
	}

	return (
		<div className="max-h-full min-h-full grid grid-cols-4 grid-rows-10 gap-2">
			<div className={`${main} border`}>
				<VideoComp
					videoRef={screenRef}
					className={currScene.screen ? "" : "hidden"}
				/>

				{currScene.board && <BoardSubscribe />}
				{currScene.slides && <SlidesStudent />}
			</div>

			<div className={`${sec} bg-gray-500 border-blue border`}>
				<VideoComp videoRef={videoRef} teacher={teacherName || "anonymous"} />

				<div className="">
					<audio ref={audioRef} muted={true} autoPlay />
				</div>
			</div>

			<div
				className={`${chat} border border-slate-300 shadow-lg overflow-hidden flex flex-col-reverse`}
			>
				<form
					onSubmit={handleSendChat}
					className="border-t p-4 flex items-center space-x-2"
				>
					<Input
						className="flex-grow rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={chatInput}
						onChange={(e) => setChatInput(e.target.value)}
						placeholder="Chat something here"
					/>

					<Button
						type="submit"
						className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
					>
						<SendButton />
					</Button>
				</form>

				<div className="p-4 overflow-y-auto flex flex-col-reverse">
					{chats?.map((chat) => {
						const [key, value] = Object.entries(chat)[0];

						return (
							<div
								key={key}
								className="flex items-center mb-3 pb-2 space-x-3 border-"
							>
								<div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
									{value.name?.charAt(0)?.toUpperCase()}
								</div>
								<div className="flex-grow">
									<div className="text-sm font-semibold text-gray-700">
										{value.name}
									</div>
									<div className="text-gray-600 text-sm bg-gray-100 p-2 rounded-lg inline-block">
										{value.text}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="col-span-4 row-span-2 mx-auto">
				<Button
					variant={"destructive"}
					className="rounded-full"
					onClick={handleLeaveRoom}
				>
					Leave Room
				</Button>
			</div>
		</div>
	);
};
