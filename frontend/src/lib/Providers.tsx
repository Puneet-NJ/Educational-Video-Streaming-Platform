import { ThemeProvider } from "@/Components/theme-provider";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Provider = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				{children}
			</ThemeProvider>
		</QueryClientProvider>
	);
};

export default Provider;
