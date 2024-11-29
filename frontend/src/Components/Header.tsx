import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { ModeToggle } from "./mode-toggle";

export const Header = () => {
	return (
		<nav className="sticky top-0 left-0 right-0 z-50 bg-gray-400 dark:bg-black/30 backdrop-blur-lg shadow-2xl border-b border-gray-200/50 dark:border-gray-800/50 h-16">
			<div className="max-w-5xl mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					<Link to="/home" className="text-2xl font-semibold">
						<Logo />
					</Link>
					<div className="flex items-center space-x-4">
						<ModeToggle />
						<Link
							to="/about"
							className="hover:bg-white/20 dark:hover:bg-black/20 px-3 py-2 rounded-lg transition-colors"
						>
							About
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};
