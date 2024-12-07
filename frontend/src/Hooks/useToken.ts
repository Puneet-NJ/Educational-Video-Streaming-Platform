import { jwtDecode } from "jwt-decode";

type Roles = "Teacher" | "Student" | "Admin";

type TokenPayload = {
	role: Roles;
	id: string;
	username: string;
};

const useToken = () => {
	const setToken = (token: string) => {
		localStorage.setItem("token", token);
	};

	const getToken = () => {
		return localStorage.getItem("token");
	};

	const decodeToken = () => {
		const token = localStorage.getItem("token") || "";
		return jwtDecode<TokenPayload>(token);
	};

	return {
		setToken,
		getToken,
		decodeToken,
	};
};

export default useToken;
