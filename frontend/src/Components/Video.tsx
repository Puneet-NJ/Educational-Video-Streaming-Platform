import useCreateToken from "@/Hooks/useCreateToken";
import useVideo from "@/Hooks/useVideo";
import { roomToken, userAtom } from "@/lib/atom";
import {
	ControlBar,
	GridLayout,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	useTracks,
} from "@livekit/components-react";

import "@livekit/components-styles";

import { Track, LocalParticipant } from "livekit-client";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

export const Video = () => {
	const user = useRecoilValue(userAtom);
	const serverUrl = import.meta.env.VITE_LIVEKIT_URL;
	const { handleJoin, handleLeave } = useVideo();
	const { createToken } = useCreateToken();
	const room_token = useRecoilValue(roomToken);

	const params = useParams();

	useEffect(() => {
		createToken({ roomId: params.roomId || "" });

		window.addEventListener("beforeunload", handleLeave);

		//

		// const room = new Room()

		// const a:LocalParticipant = room.localParticipant
		// a.setCameraEnabled

		//
		return () => {
			console.log("comp unmounted");
			window.removeEventListener("beforeunload", handleLeave);
			handleLeave();
		};
	}, []);

	return (
		<LiveKitRoom
			video={true}
			audio={true}
			token={room_token}
			serverUrl={serverUrl}
			// Use the default LiveKit theme for nice styles.
			data-lk-theme="default"
			onConnected={() => {
				handleJoin(params.roomId || "");
			}}
			onDisconnected={handleLeave}
		>
			{/* Your custom component with basic video conferencing functionality. */}
			<MyVideoConference />
			{/* The RoomAudioRenderer takes care of room-wide audio for you. */}
			<RoomAudioRenderer />
			{/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
			<div className="overflow-x-scroll ">
				<ControlBar />
			</div>

			{user.role === "Teacher" ? params.token : null}
		</LiveKitRoom>
	);
};

function MyVideoConference() {
	// `useTracks` returns all camera and screen share tracks. If a user
	// joins without a published camera track, a placeholder track is returned.
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false },
		],
		{ onlySubscribed: false }
	);

	const teachersTrack = tracks.filter(
		(track) => track.participant.permissions?.canPublish
	);

	return (
		<GridLayout tracks={teachersTrack}>
			{/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
			<ParticipantTile />
		</GridLayout>
	);
}
