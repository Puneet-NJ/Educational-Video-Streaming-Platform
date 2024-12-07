import useRoomId_Token from "@/Hooks/useRoomId_Token";
import useCreateToken from "@/Hooks/useCreateToken";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
	RemoteParticipant,
	RemoteTrack,
	RemoteTrackPublication,
	Room,
	RoomEvent,
	Track,
	VideoPresets,
	createLocalTracks,
} from "livekit-client";
import { jwtDecode } from "jwt-decode";

interface Jwt {
	sub: string;
	video: {
		canPublish: boolean;
		room: string;
		roomAdmin: boolean;
		roomJoin: boolean;
	};
}

const useVideo = () => {
	const serverUrl = import.meta.env.VITE_LIVEKIT_URL;
	const { getRoomToken } = useRoomId_Token();
	const roomToken = getRoomToken() || "";
	const { createToken } = useCreateToken();
	const params = useParams();
	const roomId = params.roomId;
	const username = useRef<String | null>(null);
	const [isTeacher, setIsTeacher] = useState(false);

	const videoRef = useRef<HTMLVideoElement | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const screenRef = useRef<HTMLVideoElement | null>(null);
	let currentRoomRef = useRef<Room | null>(null);

	const [publishVideo, setPublishVideo] = useState(true);
	const [publishAudio, setPublishAudio] = useState(true);
	const [publishScreen, setPublishScreen] = useState(false);

	useEffect(() => {
		const initializeRoom = async () => {
			try {
				if (!roomToken) {
					return;
				}

				const decodedToken = jwtDecode<Jwt>(roomToken);

				username.current = decodedToken.sub;
				const { canPublish, roomAdmin, room: tokenRoomId } = decodedToken.video;

				canPublish === true ? setIsTeacher(true) : setIsTeacher(false);

				if (tokenRoomId !== roomId) {
					return;
				}

				currentRoomRef.current = new Room({
					adaptiveStream: true,
					dynacast: true,
					videoCaptureDefaults: {
						resolution: VideoPresets.h720.resolution,
					},
				});

				currentRoomRef.current.on(
					RoomEvent.TrackSubscribed,
					handleTrackSubscribed
				);
				// currentRoomRef.current.on(
				// 	RoomEvent.ParticipantConnected,
				// 	(participant) => {
				// 		console.log("Participant connected:", participant);
				// 		console.log(
				// 			"Number of participants:",
				// 			currentRoomRef.current?.numParticipants
				// 		);

				// 		participant.trackPublications.forEach((publication) => {
				// 			publication.on("muted", () => {
				// 				console.log("muted");

				// 				handleTrackMuted(publication);
				// 			});
				// 		});
				// 	}
				// );
				if (roomAdmin) {
					await handleAdminShowTracks();
				}

				// currentRoomRef.current.remoteParticipants.forEach((participant) => {
				// 	console.log(participant);

				// 	participant.trackPublications.forEach((publication) => {
				// 		console.log(publication);

				// 		publication.on("muted", () => {
				// 			handleTrackMuted(publication);
				// 		});
				// 	});
				// });

				await currentRoomRef.current.prepareConnection(serverUrl, roomToken);
				await currentRoomRef.current.connect(serverUrl, roomToken);

				// publish video & audio if teacher
				if (roomAdmin && canPublish) {
					try {
						if (!(videoRef.current?.srcObject instanceof MediaStream)) {
							return;
						}

						const videoTracks = videoRef.current.srcObject.getVideoTracks();

						const publishVideo =
							await currentRoomRef.current.localParticipant.publishTrack(
								videoTracks[0],
								{
									name: "videoTrack",
									simulcast: true,
									source: Track.Source.Camera,
								}
							);

						if (!(audioRef.current?.srcObject instanceof MediaStream)) {
							return;
						}

						const audioTracks = audioRef.current.srcObject.getTracks();

						const publishAudio =
							await currentRoomRef.current.localParticipant.publishTrack(
								audioTracks[0],
								{
									name: "audioTrack",
									simulcast: true,
									source: Track.Source.Microphone,
								}
							);

						// if (roomAdmin && canPublish) {
						// 	handleCameraToggle();
						// 	handleMicrophoneToggle();
						// }
					} catch (err) {
						console.log(err);
					}
				}
			} catch (error) {
				console.error("Room initialization error:", error);
			}
		};

		createToken({ roomId: roomId || "" });
		initializeRoom();

		window.addEventListener("beforeunload", () => {
			if (currentRoomRef.current) {
				currentRoomRef.current.disconnect();
			}

			if (videoRef.current) {
				videoRef.current.srcObject = null;
			}
		});

		return () => {
			console.log("video comp unmounted");

			if (currentRoomRef.current) {
				currentRoomRef.current.disconnect();
			}

			if (videoRef.current) {
				videoRef.current.srcObject = null;
			}
		};
	}, [roomToken, roomId, serverUrl]);

	const handleCameraToggle = async () => {
		console.log("cam toggle");

		try {
			if (publishVideo) {
				await currentRoomRef.current?.localParticipant.setCameraEnabled(false);
			} else {
				await currentRoomRef.current?.localParticipant.setCameraEnabled(true);
			}

			setPublishVideo((prev) => !prev);
		} catch (err) {
			console.log(err);
		}
	};

	const handleMicrophoneToggle = async () => {
		try {
			if (publishAudio) {
				await currentRoomRef.current?.localParticipant.setMicrophoneEnabled(
					false
				);
			} else {
				await currentRoomRef.current?.localParticipant.setMicrophoneEnabled(
					true
				);
			}

			setPublishAudio((prev) => !prev);
		} catch (err) {
			console.log(err);
		}
	};

	const handleShareScreenToggle = async () => {
		try {
			if (publishScreen) {
				await currentRoomRef.current?.localParticipant.setScreenShareEnabled(
					false
				);
			} else {
				const localTrack =
					await currentRoomRef.current?.localParticipant.setScreenShareEnabled(
						true
					);

				if (!localTrack || !localTrack.track) {
					console.log("No tracks found");
					return;
				}

				screenRef.current!.srcObject = null;

				const mediaStream = new MediaStream([
					localTrack.track.mediaStreamTrack,
				]);

				screenRef.current!.srcObject = mediaStream;
			}

			setPublishScreen((prev) => !prev);
		} catch (err) {
			console.log(err);
		}
	};

	const handleTrackSubscribed = async (
		track: RemoteTrack,
		publication: RemoteTrackPublication,
		participant: RemoteParticipant
	) => {
		console.log(track);

		if (track.source === "screen_share") {
			screenRef.current!.srcObject = null;

			const mediaStream = new MediaStream([track.mediaStreamTrack]);

			screenRef.current!.srcObject = mediaStream;
		}
		if (
			track.kind === "video" &&
			track.source === "camera" &&
			videoRef.current
		) {
			videoRef.current.srcObject = null;

			const mediaStream = new MediaStream([track.mediaStreamTrack]);

			videoRef.current.srcObject = mediaStream;
		} else if (track.kind === "audio") {
			audioRef.current!.srcObject = null;

			const mediaStream = new MediaStream([track.mediaStreamTrack]);

			audioRef.current!.srcObject = mediaStream;

			audioRef.current!.muted = false;
		}
	};

	const handleAdminShowTracks = async () => {
		try {
			const tracks = await createLocalTracks({
				audio: true,
				video: true,
			});

			const audioTrack = tracks.find((track) => track.kind === "audio");
			if (audioTrack && audioRef.current) {
				audioRef.current.srcObject = new MediaStream([
					audioTrack.mediaStreamTrack,
				]);
			}

			const videoTrack = tracks.find((track) => track.kind === "video");
			if (videoTrack && videoRef.current) {
				const videoElement = videoTrack.attach();
				videoRef.current.srcObject = videoElement.srcObject;
				await videoRef.current.play();
			}
		} catch (error) {
			console.error("Error creating local tracks:", error);
		}
	};

	// const handleTrackMuted = (publication: TrackPublication) => {
	// 	console.log("muted");

	// 	if (publication.track?.kind === "video") {
	// 		videoRef.current!.srcObject = null;
	// 	}
	// };

	return {
		videoRef,
		audioRef,
		screenRef,
		username: username.current,
		handleCameraToggle,
		handleMicrophoneToggle,
		handleShareScreenToggle,

		publishVideo,
		publishAudio,
		publishScreen,

		isTeacher,
	};
};

export default useVideo;
