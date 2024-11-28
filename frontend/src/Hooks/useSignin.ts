import { BACKEND_URL } from "@/lib/lib";
import { signinFormSchema } from "@/lib/Types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import useToken from "./useToken";
import { userAtom } from "@/lib/atom";
import { useSetRecoilState } from "recoil";

const useSignin = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setToken, decodeToken } = useToken();
	const setUserToken = useSetRecoilState(userAtom);

	const mutation = useMutation({
		mutationFn: (values: z.infer<typeof signinFormSchema>) => {
			return axios({
				method: "POST",
				url: `${BACKEND_URL}/user/signin`,
				data: values,
			}).then((res) => res.data);
		},
		onSuccess: (data) => {
			setToken(data.token);
			queryClient.invalidateQueries({ queryKey: ["user"] });
			navigate("/home");

			const { username, id, role } = decodeToken();
			setUserToken({ username, id, role });
		},
	});

	const form = useForm<z.infer<typeof signinFormSchema>>({
		resolver: zodResolver(signinFormSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof signinFormSchema>) {
		mutation.mutate(values);
	}

	return {
		form,
		onSubmit,
	};
};

export default useSignin;
