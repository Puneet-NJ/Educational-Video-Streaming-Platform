import { BACKEND_URL } from "@/lib/lib";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import useToken from "./useToken";
import useRoomId_Token from "./useRoomId_Token";
import { useSetRecoilState } from "recoil";
import { roomNameAtom, teacherNameAtom } from "@/lib/atom";

const useCreateToken = () => {
	const { getToken } = useToken();
	const { setRoomToken } = useRoomId_Token();
	const setTeacherName = useSetRecoilState(teacherNameAtom);
	const setRoomName = useSetRecoilState(roomNameAtom);

	const mutation = useMutation({
		mutationFn: (values: { roomId: string }) =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/room/token`,
				headers: { Authorization: `Bearer ${getToken()}` },
				data: values,
			}).then((response) => ({
				token: response.data.token,
				teacher: response.data.teacher,
				roomName: response.data.roomName,
			})),

		onSuccess: (data) => {
			const roomToken = data.token;
			const teacher = data.teacher;
			const roomName = data.roomName;

			setRoomToken(roomToken);
			setTeacherName(teacher);
			setRoomName(roomName);
		},
	});

	const createToken = ({ roomId: roomId }: { roomId: string }) => {
		mutation.mutate({ roomId });
	};

	return { createToken };
};

export default useCreateToken;
