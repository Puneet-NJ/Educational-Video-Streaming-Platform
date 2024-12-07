import useToken from "@/Hooks/useToken";
import HomeTeacher from "./HomeTeacher";
import HomeStudent from "./HomeStudent";

const Home = () => {
	const { decodeToken } = useToken();

	return (
		<div className="h-full">
			{decodeToken().role === "Teacher" ? <HomeTeacher /> : <HomeStudent />}
		</div>
	);
};

export default Home;
