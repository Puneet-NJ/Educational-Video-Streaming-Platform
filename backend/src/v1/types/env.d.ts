declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT?: string;
			DATABASE_URL?: string;
			JWT_SECRET: string;
			LIVEKIT_API_KEY: string;
			LIVEKIT_API_SECRET: string;
			LIVEKIT_URL: string;
			AWS_ACCESS_KEY_ID: string;
			AWS_SECRET_ACCESS_KEY: string;
		}
	}
}

// Make this a module to ensure proper TypeScript compilation
export {};
