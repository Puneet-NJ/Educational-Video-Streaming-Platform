// src/utils/env.ts
export function getEnvVar(key: string): string {
	const value = process.env[key];
	if (value === undefined) {
		throw new Error(`Environment variable ${key} is not set`);
	}
	return value;
}

// Usage example
import dotenv from "dotenv";
dotenv.config();

// In your main file or other files
const PORT = getEnvVar("PORT");
const DATABASE_URL = getEnvVar("DATABASE_URL");
const JWT_SECRET = getEnvVar("JWT_SECRET");
