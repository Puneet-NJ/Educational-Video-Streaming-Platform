import { NextFunction, Request, Response } from "express";
import jwt, { customFields } from "jsonwebtoken";

type Roles = "Teacher" | "Admin" | "Student";

declare module "jsonwebtoken" {
	export interface customFields extends jwt.JwtPayload {
		id: String;
		username: String;
		role: Roles;
	}
}

const auth = (roles: Roles[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization?.split(" ")[1] || "";

			let decodedToken;
			try {
				decodedToken = jwt.verify(
					token,
					process.env.JWT_SECRET
				) as customFields;
			} catch (err) {
				res.status(411).json({ msg: "Invalid token" });
				return;
			}

			if (roles.includes(decodedToken.role)) {
				res.locals.id = decodedToken.id;
				res.locals.username = decodedToken.username;
				res.locals.role = decodedToken.role;

				return next();
			}

			res.status(401).json({ msg: "Unauthorized" });
			return;
		} catch (err) {
			res.status(500).json({ msg: "Internal server error" });
			return;
		}
	};
};

export default auth;
