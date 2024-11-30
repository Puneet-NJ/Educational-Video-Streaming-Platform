import { createTokenSchema } from "@/lib/Types";
import { BACKEND_URL } from "@/lib/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import useToken from "./useToken";
import { useSetRecoilState } from "recoil";
import { roomAtom, roomToken } from "@/lib/atom";

const useCreateToken = () => {
	const setRoomToken = useSetRecoilState(roomToken);
	const setRoom = useSetRecoilState(roomAtom);
	const { getToken } = useToken();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (values: z.infer<typeof createTokenSchema>) =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/room/token`,
				headers: { Authorization: `Bearer ${getToken()}` },
				data: values,
			}).then((res) => ({
				token: res.data.token,
				roomId: values.roomId,
				roomName: res.data.roomName,
			})),

		onSuccess: (data) => {
			setRoom({ roomId: data.roomId, roomName: data.roomName });
			setRoomToken(data.token);
			queryClient.invalidateQueries({ queryKey: ["room"] });
		},
	});

	function createToken(values: z.infer<typeof createTokenSchema>) {
		mutation.mutate(values);
	}

	return {
		createToken,
	};
};

export default useCreateToken;
