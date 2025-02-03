import { Logo } from "../Logo";
import { ModeToggle } from "../mode-toggle";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="px-32">
			<header className="fixed top-0 left-0 right-0 z-50 bg-gray-300 dark:bg-black/30 backdrop-blur-md shadow-lg border-b border-gray-200/30 dark:border-gray-800/30">
				<div className="flex justify-between items-center w-full h-16 px-32">
					<div>
						<Logo />
					</div>

					<div>
						<ModeToggle />
					</div>
				</div>
			</header>

			<div className="pt-28 h-[calc(100vh)]">{children}</div>
		</div>
	);
};

export default Layout;
