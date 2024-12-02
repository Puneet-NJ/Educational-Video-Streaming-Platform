import useCreateRoom from "@/Hooks/useCreateRoom";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export const CreateRoomForm = () => {
	const { form, onSubmit } = useCreateRoom();

	return (
		<div className="w-1/3 border p-10 bg-gray-300 rounded shadow-2xl dark:bg-inherit">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="roomName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Room Name</FormLabel>
								<FormControl>
									<Input placeholder="HTML Class-73" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Input placeholder="..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="maxParticipants"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Maximum Participants</FormLabel>
								<FormControl>
									<Input
										type="number"
										min={2}
										{...field}
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
								<FormDescription>
									Maximum Participants in the room including you
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Create Room</Button>
				</form>
			</Form>
		</div>
	);
};
