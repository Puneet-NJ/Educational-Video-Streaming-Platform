import useToken from "@/Hooks/useToken";
import HomeTeacher from "./HomeTeacher";
import HomeStudent from "./HomeStudent";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/lib/atom";

const Home = () => {
	const { decodeToken } = useToken();
	const userToken = useRecoilValue(userAtom);

	console.log(userToken);

	return (
		<div>
			{decodeToken().role === "Teacher" ? <HomeTeacher /> : <HomeStudent />}
		</div>
	);
};

export default Home;
