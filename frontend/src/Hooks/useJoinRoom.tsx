import { BACKEND_URL } from "@/lib/lib";
import { joinRoomSchema } from "@/lib/Types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useToken from "./useToken";
import { useSetRecoilState } from "recoil";
import { roomAtom } from "@/lib/atom";
import { useNavigate } from "react-router-dom";

const useJoinRoom = () => {
	const { getToken } = useToken();
	const setRoom = useSetRecoilState(roomAtom);
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: (values: z.infer<typeof joinRoomSchema>) =>
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
			setRoom(data);
			queryClient.invalidateQueries({ queryKey: ["room"] });
			navigate("/space");
		},
	});

	const form = useForm<z.infer<typeof joinRoomSchema>>({
		resolver: zodResolver(joinRoomSchema),
		defaultValues: {
			roomId: "",
		},
	});

	function onSubmit(values: z.infer<typeof joinRoomSchema>) {
		mutation.mutate(values);
	}

	return {
		form,
		onSubmit,
	};
};

export default useJoinRoom;
