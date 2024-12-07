import { createLocalTracks, LocalTrack } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRoomId_Token from "./useRoomId_Token";

const useCheckCard = () => {
	const [camera, setCamera] = useState(true);
	const [mic, setMic] = useState(true);
	const tracksRef = useRef<HTMLVideoElement | null>(null);
	const localTracksRef = useRef<LocalTrack[] | null>(null);
	const navigate = useNavigate();
	const { getRoomId } = useRoomId_Token();

	useEffect(() => {
		clearTracks();

		(async () => {
			try {
				await createTrack();

				const videoTrack = localTracksRef.current!.find(
					(track) => track.kind === "video"
				);
				if (!videoTrack) {
					console.log("Video track not found");
					return;
				}

				tracksRef.current!.srcObject = new MediaStream([
					videoTrack.mediaStreamTrack,
				]);

				console.log(tracksRef.current?.srcObject);
			} catch (err) {
				tracksRef.current!.srcObject = null;

				console.log(err);
			}
		})();

		return () => {
			clearTracks();
		};
	}, [camera]);

	const createTrack = async () => {
		if (localTracksRef.current) return;

		localTracksRef.current = await createLocalTracks({
			audio: true,
			video: camera,
		});
	};

	const handleCameraToggle = () => {
		setCamera((prev) => !prev);
	};

	const handleMicToggle = () => {
		setMic((prev) => !prev);
	};

	const handleJoinRoom = () => {
		const roomId = getRoomId();

		navigate(`/space/${roomId}`);
	};

	const clearTracks = () => {
		localTracksRef.current?.map((track) => {
			track.detach();
			track.stop();
		});
		localTracksRef.current = null;

		if (tracksRef.current) tracksRef.current.srcObject = null;
	};

	return { tracksRef, handleCameraToggle, handleMicToggle, handleJoinRoom };
};

export default useCheckCard;
