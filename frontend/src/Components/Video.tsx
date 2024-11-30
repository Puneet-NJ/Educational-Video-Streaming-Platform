import useVideo from "@/Hooks/useVideo";
import { roomAtom, userAtom } from "@/lib/atom";
import {
	ControlBar,
	GridLayout,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	useTracks,
} from "@livekit/components-react";

import "@livekit/components-styles";

import { Track } from "livekit-client";
import { useRecoilValue } from "recoil";

export const Video = () => {
	const room = useRecoilValue(roomAtom);
	const user = useRecoilValue(userAtom);
	const serverUrl = import.meta.env.VITE_LIVEKIT_URL;
	const { handleJoin, handleLeave } = useVideo();

	console.log(room, serverUrl);
	if (user.role === "Teacher") console.log(room.roomId);

	return (
		<LiveKitRoom
			video={true}
			audio={true}
			token={room.token}
			serverUrl={serverUrl}
			// Use the default LiveKit theme for nice styles.
			data-lk-theme="default"
			onConnected={handleJoin}
			onDisconnected={handleLeave}
		>
			{/* Your custom component with basic video conferencing functionality. */}
			<MyVideoConference />
			{/* The RoomAudioRenderer takes care of room-wide audio for you. */}
			<RoomAudioRenderer />
			{/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
			<ControlBar />

			{user.role === "Teacher" ? room.roomId : null}
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
	return (
		<GridLayout
			tracks={tracks}
			style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
		>
			{/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
			<ParticipantTile />
		</GridLayout>
	);
}
