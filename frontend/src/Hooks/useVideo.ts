import { BACKEND_URL } from "@/lib/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useToken from "./useToken";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { participantIdAtom, roomAtom } from "@/lib/atom";

const useVideo = () => {
	const { getToken } = useToken();
	const room = useRecoilValue(roomAtom);
	const setParticipantId = useSetRecoilState(participantIdAtom);
	const participantId = useRecoilValue(participantIdAtom);
	const queryClient = useQueryClient();

	const joinMutate = useMutation({
		mutationFn: () =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/room/join`,
				headers: { Authorization: `Bearer ${getToken()}` },
				data: {
					roomId: room.roomId,
				},
			}).then((res) => res.data),

		onSuccess: (data) => {
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

	const handleJoin = () => {
		joinMutate.mutate();
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
