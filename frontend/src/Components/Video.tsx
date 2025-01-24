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
		teacherRoomId,
	} = useVideo();
	const teacher = useRecoilValue(teacherNameAtom);

	return (
		<div>
			<video
				ref={videoRef}
				style={{ width: "100%", height: "100%" }}
				autoPlay
				muted
				playsInline
			/>

			{isTeacher ? (
				<>
					<video
						ref={screenRef}
						autoPlay
						muted
						playsInline
						className={!publishScreen ? "hidden" : ""}
					/>
					<span>RoomId: {teacherRoomId}</span>
				</>
			) : (
				<video
					ref={screenRef}
					autoPlay
					muted
					playsInline
					// className={!publishScreen ? "hidden" : ""}
				/>
			)}

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
