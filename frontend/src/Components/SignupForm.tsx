import { Button } from "./ui/button";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import useSignup from "@/Hooks/useSignup";
import { Logo } from "./Logo";

export const SignupForm = () => {
	const { form, onSubmit } = useSignup();

	return (
		<div className="w-1/4 px-10 py-7 shadow-2xl flex flex-col gap-5 rounded bg-gray-300 border dark:border-gray-700 dark:bg-inherit">
			<div className="flex justify-center">
				<Logo />
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

					<FormField
						control={form.control}
						name="role"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Role</FormLabel>
								<FormControl>
									<Select {...field} onValueChange={field.onChange}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Role" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Student">Student</SelectItem>
											<SelectItem value="Teacher">Teacher</SelectItem>
											<SelectItem value="Admin">Admin</SelectItem>
										</SelectContent>
									</Select>
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
