import React from "react";
import { Header } from "./Components/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-screen min-h-screen">
			<Header />
			<div className="h-[calc(100vh-4rem)] border">{children}</div>
		</div>
	);
};

export default Layout;
