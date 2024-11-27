import { BACKEND_URL } from "@/lib/lib";
import { signinFormSchema } from "@/lib/Types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const useSignin = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (values: z.infer<typeof signinFormSchema>) =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/user/signin`,
				data: values,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			navigate("/");
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
