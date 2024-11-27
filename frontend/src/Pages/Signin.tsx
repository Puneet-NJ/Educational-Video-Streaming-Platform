import { ModeToggle } from "@/Components/mode-toggle";
import { SigninForm } from "../Components/SigninForm";

const Signin = () => {
	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<ModeToggle />
			<SigninForm />
		</div>
	);
};

export default Signin;
