import useToken from "@/Hooks/useToken";
import HomeTeacher from "./HomeTeacher";
import HomeStudent from "./HomeStudent";

const Home = () => {
	const { decodeToken } = useToken();
	console.log(decodeToken, "hi");

	return (
		<div>
			{decodeToken().role === "Teacher" ? <HomeTeacher /> : <HomeStudent />}
		</div>
	);
};

export default Home;
