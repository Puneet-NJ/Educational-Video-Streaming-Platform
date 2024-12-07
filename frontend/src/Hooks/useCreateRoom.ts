import { BACKEND_URL } from "@/lib/lib";
import { createRoomSchema } from "@/lib/Types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useToken from "./useToken";
import useRoomId_Token from "./useRoomId_Token";
import { useNavigate } from "react-router-dom";

const useCreateRoom = () => {
	const { getToken } = useToken();
	const queryClient = useQueryClient();
	const { setRoomId } = useRoomId_Token();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: (values: z.infer<typeof createRoomSchema>) =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/room/`,
				headers: { Authorization: `Bearer ${getToken()}` },
				data: values,
			}).then((response) => response.data),
		onSuccess: (data) => {
			const roomId = data.roomId;

			setRoomId(roomId);

			queryClient.invalidateQueries({ queryKey: ["room"] });

			navigate("/check");
		},
	});

	const form = useForm<z.infer<typeof createRoomSchema>>({
		resolver: zodResolver(createRoomSchema),
		defaultValues: {
			roomName: "",
			description: "",
			maxParticipants: 2,
		},
	});

	const onSubmit = (values: z.infer<typeof createRoomSchema>) => {
		mutation.mutate(values);
	};

	return { form, onSubmit };
};

export default useCreateRoom;
