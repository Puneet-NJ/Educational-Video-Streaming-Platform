import useRoomToken from "@/Hooks/useRoomToken";
import useCreateToken from "@/Hooks/useCreateToken";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
	LocalParticipant,
	LocalTrackPublication,
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
import { useRecoilValue, useSetRecoilState } from "recoil";
import { roomIdAtom, userInRoomIdAtom } from "@/lib/atom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/lib/lib";
import useToken from "./useToken";

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

	const { createToken } = useCreateToken();
	const username = useRef<string | null>(null);
	const [isTeacher, setIsTeacher] = useState<boolean | null>(); //

	const videoRef = useRef<HTMLVideoElement | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const screenRef = useRef<HTMLVideoElement | null>(null);
	let currentRoomRef = useRef<Room | null>(null);

	const [publishVideo, setPublishVideo] = useState(true);
	const [publishAudio, setPublishAudio] = useState(true);
	const [publishScreen, setPublishScreen] = useState(false);
	const [teacherRoomId, setTeacherRoomId] = useState("");

	const { getToken } = useToken();
	const setUserInRoomId = useSetRecoilState(userInRoomIdAtom);
	const userInRoomId = useRecoilValue(userInRoomIdAtom);
	const navigate = useNavigate();

	const setRoomId = useSetRecoilState(roomIdAtom);
	const roomIdRecoil = useRecoilValue(roomIdAtom);

	const [searchParams, setSearchParams] = useSearchParams();
	const { getRoomToken, clearRoomToken } = useRoomToken();

	let roomToken: string | null = null;
	const token = searchParams.get("at");
	if (token) {
		roomToken = token;
	} else {
		const roomToken_ss = getRoomToken();

		if (roomToken_ss) roomToken = roomToken_ss;
	}

	const params = useParams();
	let roomId = params.roomId?.trim() || roomIdRecoil;

	const joinRoomMutation = useMutation({
		mutationFn: () =>
			axios({
				url: `${BACKEND_URL}/room/join/${roomId}`,
				method: "POST",
				headers: { Authorization: `Bearer ${getToken()}` },
			}),

		onSuccess: (response) => {
			setUserInRoomId(response.data.id);
		},
	});

	const leaveRoomMutation = useMutation({
		mutationFn: () =>
			axios({
				url: `${BACKEND_URL}/room/leave/${userInRoomId}`,
				method: "POST",
				headers: { Authorization: `Bearer ${getToken()}` },
			}),

		onSuccess: () => {
			navigate("/home");
		},
	});

	useEffect(() => {
		const initializeRoom = async () => {
			try {
				if (!roomToken) {
					return;
				}

				const decodedToken = jwtDecode<Jwt>(roomToken);

				username.current = decodedToken.sub;
				const { canPublish, roomAdmin, room: tokenRoomId } = decodedToken.video;

				if (canPublish) setIsTeacher(true);
				else setIsTeacher(false);

				setRoomId(tokenRoomId);

				if (isTeacher) {
					setTeacherRoomId(tokenRoomId || "");
				}

				if (!isTeacher && tokenRoomId !== roomId) {
					clearRoomToken();

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

				if (roomAdmin) {
					await handleAdminShowTracks();
				}

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
					} catch (err) {
						console.log(err);
					}
				}
			} catch (error) {
				console.error("Room initialization error:", error);
			}
		};

		if (!roomToken) {
			createToken({ roomId: roomId || "" });
		}

		initializeRoom();

		if (roomId) handleJoinRoom();

		return () => {
			console.log("video comp unmounted");

			if (currentRoomRef.current) {
				currentRoomRef.current.disconnect();
			}

			if (videoRef.current) {
				videoRef.current.srcObject = null;
			}
		};
	}, [roomToken, roomId, serverUrl, isTeacher]);

	const handleCameraToggle = async () => {
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
				// await videoRef.current.play();
			}
		} catch (error) {
			console.error("Error creating local tracks:", error);
		}
	};

	const handleJoinRoom = () => {
		joinRoomMutation.mutate();
	};

	const handleLeaveRoom = async () => {
		try {
			const localParticipant = currentRoomRef.current?.localParticipant;

			if (localParticipant) {
				// Remove all published tracks
				localParticipant.getTrackPublications().forEach(async (publication) => {
					if (publication.track) {
						publication.track.detach();
						await localParticipant.unpublishTrack(
							publication.track.mediaStreamTrack
						);
					}
				});

				// Stop all tracks
				const localTracks = [
					videoRef.current?.srcObject as MediaStream,
					audioRef.current?.srcObject as MediaStream,
					screenRef.current?.srcObject as MediaStream,
				];

				localTracks.forEach((mediaStream) => {
					if (mediaStream) {
						mediaStream.getTracks().forEach((track) => track.stop());
					}
				});
			}

			// Disconnect from room
			await currentRoomRef.current?.disconnect();

			// Clear all refs
			if (videoRef.current) videoRef.current.srcObject = null;
			if (audioRef.current) audioRef.current.srcObject = null;
			if (screenRef.current) screenRef.current.srcObject = null;

			// Trigger room leave mutation
			leaveRoomMutation.mutate();
		} catch (error) {
			console.error("Error leaving room:", error);
		}
	};

	return {
		videoRef,
		audioRef,
		screenRef,
		username: username.current,
		handleCameraToggle,
		handleMicrophoneToggle,
		handleShareScreenToggle,
		handleLeaveRoom,

		publishVideo,
		publishAudio,
		publishScreen,

		isTeacher,
		teacherRoomId,
	};
};

export default useVideo;
