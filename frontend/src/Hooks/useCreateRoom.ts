import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createRoomSchema } from "@/lib/Types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/lib/lib";
import { useSetRecoilState } from "recoil";
import { roomAtom } from "@/lib/atom";
import useToken from "./useToken";
import { useNavigate } from "react-router-dom";

const useCreateRoom = () => {
	const queryClient = useQueryClient();
	const setRoom = useSetRecoilState(roomAtom);
	const { getToken } = useToken();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: (values: z.infer<typeof createRoomSchema>) =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/room`,
				headers: { Authorization: `Bearer ${getToken()}` },
				data: values,
			}).then((response) => ({
				roomId: response.data.roomId,
				roomName: values.roomName,
			})),
		onSuccess: (data) => {
			setRoom({
				roomId: data.roomId,
				roomName: data.roomName,
			});

			queryClient.invalidateQueries({ queryKey: ["room"] });
			navigate(`/space/${data.roomId}`);
		},
	});

	const form = useForm<z.infer<typeof createRoomSchema>>({
		resolver: zodResolver(createRoomSchema),
		defaultValues: {
			roomName: "",
			description: "",
			canParticipantsPublish: false,
			maxParticipants: 2,
		},
	});

	function onSubmit(values: z.infer<typeof createRoomSchema>) {
		mutation.mutate(values);
	}

	return { form, onSubmit };
};

export default useCreateRoom;
