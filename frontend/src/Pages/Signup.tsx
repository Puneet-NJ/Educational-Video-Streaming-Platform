import { ModeToggle } from "@/Components/mode-toggle";
import { SignupForm } from "../Components/SignupForm";

const Signup = () => {
	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<ModeToggle />
			<SignupForm />
		</div>
	);
};

export default Signup;
