import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { LOGO } from "@/lib/lib";
import useSignin from "@/Hooks/useSignin";

export const SigninForm = () => {
	const { form, onSubmit } = useSignin();

	return (
		<div className="w-1/4 px-10 py-7 shadow-lg flex flex-col gap-5 rounded bg-gray-700 bg-opacity-25 border dark:border-gray-700">
			<div className="flex justify-center">
				<img src={LOGO} />
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input
										placeholder="johndoe"
										{...field}
										className="border border-gray-700"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										{...field}
										className="border border-gray-700"
										type="password"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="">
						<Button type="submit" className="w-full">
							Submit
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
