import BoardPublish from "@/Components/BoardPublish";
import { SlidesTeacher } from "@/Components/SlidesTeacher";
import { VideoComp } from "./VideoComp";
import useDummyVideo from "../Hooks/useDummyVideo";
import { teacherNameAtom } from "@/lib/atom";
import { useRecoilValue } from "recoil";
import { MenubarTeacher } from "./MenubarTeacher";
import useHostComp from "@/Hooks/useHostComp";

export const HostComp = () => {
	const {
		videoRef,
		audioRef,
		screenRef,
		teacherRoomId,
		publishScreen,
		publishAudio,
		publishVideo,
		handleCameraToggle,
		handleMicrophoneToggle,
		handleShareScreenToggle,
	} = useDummyVideo();

	const { currScene, setCurrScene } = useHostComp();

	const teacher = useRecoilValue(teacherNameAtom);

	let main = "col-span-3 row-span-8";
	let sec = "col-span-1 row-span-2";
	let chat = "col-span-1 row-span-6";
	if (currScene.default) {
		main = "hidden";
		sec = "col-span-3 row-span-8";
		chat = "col-span-1 row-span-8";
	}

	console.log();
	return (
		<div className="max-h-full min-h-full grid grid-cols-4 grid-rows-10 gap-2">
			<div className={`${main} border`}>
				<video
					ref={screenRef}
					autoPlay
					muted
					playsInline
					className={publishScreen ? "" : "hidden"}
				/>

				{currScene.board && <BoardPublish />}
				{currScene.slides && <SlidesTeacher />}
				{/* {currScene.default && <BoardPublish />} */}
			</div>

			<div className={`${sec} bg-yellow-200 border-blue border`}>
				<VideoComp videoRef={videoRef} teacher={teacher || "hi"} />

				<div className="">
					<audio ref={audioRef} muted={true} autoPlay />
				</div>
			</div>

			<div className={`${chat} bg-red-200 border-orange-700 border`}></div>

			<div className="col-span-4 row-span-2">
				<MenubarTeacher
					publishAudio={publishAudio}
					publishScreen={publishScreen}
					publishVideo={publishVideo}
					handleCameraToggle={handleCameraToggle}
					handleMicrophoneToggle={handleMicrophoneToggle}
					handleShareScreenToggle={handleShareScreenToggle}
					setCurrScene={setCurrScene}
				/>
				<div>{teacherRoomId}</div>

				{/* <SlidesTeacher /> */}
			</div>
		</div>
	);
};
