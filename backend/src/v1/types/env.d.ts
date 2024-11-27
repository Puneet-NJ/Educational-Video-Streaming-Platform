declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT?: string;
			DATABASE_URL?: string;
			JWT_SECRET: string;
		}
	}
}

// Make this a module to ensure proper TypeScript compilation
export {};
