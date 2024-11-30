import { BACKEND_URL } from "@/lib/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useToken from "./useToken";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { participantIdAtom } from "@/lib/atom";

const useVideo = () => {
	const { getToken } = useToken();
	const setParticipantId = useSetRecoilState(participantIdAtom);
	const participantId = useRecoilValue(participantIdAtom);
	const queryClient = useQueryClient();

	const joinMutate = useMutation({
		mutationFn: (roomId: string) =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/room/join`,
				headers: { Authorization: `Bearer ${getToken()}` },
				data: {
					roomId: roomId,
				},
			}).then((res) => res.data),

		onSuccess: (data) => {
			console.log(data);

			setParticipantId(data.id);
			queryClient.invalidateQueries({ queryKey: ["participantId"] });
		},
	});

	const leaveMutate = useMutation({
		mutationFn: () =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/room/leave`,
				headers: { Authorization: `Bearer ${getToken()}` },
				data: {
					participationId: participantId,
				},
			}),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["participantId"],
			});
		},
	});

	const handleJoin = (roomId: string) => {
		console.log("handle join", roomId);

		if (roomId === "") return;
		joinMutate.mutate(roomId);
	};

	const handleLeave = () => {
		leaveMutate.mutate();
	};

	return {
		handleJoin,
		handleLeave,
	};
};

export default useVideo;
