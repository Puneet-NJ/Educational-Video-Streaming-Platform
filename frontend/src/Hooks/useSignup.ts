import { BACKEND_URL } from "@/lib/lib";
import { signupFormSchema } from "@/lib/Types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const useSignup = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (values: z.infer<typeof signupFormSchema>) =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/user/signup`,
				data: values,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			navigate("/home");
		},
	});

	const form = useForm<z.infer<typeof signupFormSchema>>({
		resolver: zodResolver(signupFormSchema),
		defaultValues: {
			role: "Student",
			username: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof signupFormSchema>) {
		mutation.mutate(values);
	}

	return {
		form,
		onSubmit,
	};
};

export default useSignup;
