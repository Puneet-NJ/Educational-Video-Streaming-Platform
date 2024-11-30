import useJoinRoom from "@/Hooks/useJoinRoom";
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

const JoinRoomForm = () => {
	const { form, onSubmit } = useJoinRoom();

	return (
		<div className="w-1/3 border p-10 bg-gray-300 rounded shadow-2xl dark:bg-inherit">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="roomId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Room ID</FormLabel>
								<FormControl>
									<Input placeholder="HTML Class-73" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Join Room</Button>
				</form>
			</Form>
		</div>
	);
};

export default JoinRoomForm;
