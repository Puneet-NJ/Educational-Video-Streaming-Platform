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
import { Switch } from "./ui/switch";

export const CreateRoomForm = () => {
	const { form, onSubmit } = useCreateRoom();

	return (
		<div className="w-1/3 border p-10">
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
								{/* <FormDescription>
								This is your public display name.
							</FormDescription> */}
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
								{/* <FormDescription>
								This is your public display name.
							</FormDescription> */}
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

					<FormField
						control={form.control}
						name="canParticipantsPublish"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
								<div className="space-y-0.5">
									<FormLabel>Participant publishment</FormLabel>
									<FormDescription>
										Can the participants of the room publish
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<Button type="submit">Create Room</Button>
				</form>
			</Form>
		</div>
	);
};
