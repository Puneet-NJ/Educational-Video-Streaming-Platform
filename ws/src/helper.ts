import jwt from "jsonwebtoken";

interface JWT_Payload extends jwt.JwtPayload {
	id: string;
	username: string;
	role: "Student" | "Teacher" | "Admin";
}

export const jwtVerify = (token: string) => {
	try {
		const value = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JWT_Payload;

		return value;
	} catch (err) {
		return "error";
	}
};

export const processStroke = (stroke: any) => {
	const dummyAppState = { ...stroke.appState };
	dummyAppState.collaborators = [];
	dummyAppState.viewModeEnabled = true;

	const dummyStroke = {
		elements: stroke.elements,
		appState: dummyAppState,
	};

	return dummyStroke;
};
