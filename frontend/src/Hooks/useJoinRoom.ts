import { joinRoomSchema } from "@/lib/Types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const useJoinRoom = () => {
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof joinRoomSchema>>({
		resolver: zodResolver(joinRoomSchema),
		defaultValues: {
			roomId: "",
		},
	});

	function onSubmit(values: z.infer<typeof joinRoomSchema>) {
		navigate(`/watch/${values.roomId}`);
	}

	return {
		form,
		onSubmit,
	};
};

export default useJoinRoom;
