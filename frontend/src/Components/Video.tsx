import useVideo from "@/Hooks/useVideo";
import { teacherNameAtom } from "@/lib/atom";
import { useRecoilValue } from "recoil";
import { Button } from "./ui/button";

export const Video = () => {
	const {
		videoRef,
		handleCameraToggle,
		handleMicrophoneToggle,
		handleShareScreenToggle,
		audioRef,
		screenRef,

		publishVideo,
		publishAudio,
		publishScreen,

		isTeacher,
	} = useVideo();
	const teacher = useRecoilValue(teacherNameAtom);

	console.log(publishScreen);

	return (
		<div>
			<video
				ref={videoRef}
				style={{ width: "100%", height: "100%" }}
				autoPlay
				muted
				playsInline
			/>
			<video
				ref={screenRef}
				autoPlay
				muted
				playsInline
				className={isTeacher && !publishScreen ? "hidden" : ""}
			/>
			<audio ref={audioRef} muted={true} autoPlay />
			<div>Teacher Name: {teacher}</div>

			<div>
				{isTeacher && (
					<>
						<Button
							onClick={handleCameraToggle}
							variant={!publishVideo ? "destructive" : "default"}
						>
							Camera
						</Button>
						<Button
							onClick={handleMicrophoneToggle}
							variant={!publishAudio ? "destructive" : "default"}
						>
							Microphone
						</Button>
						<Button
							onClick={handleShareScreenToggle}
							variant={!publishScreen ? "destructive" : "default"}
						>
							Share screeen
						</Button>
					</>
				)}
			</div>
		</div>
	);
};
