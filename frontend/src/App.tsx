import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Home from "./Pages/Home";
import Layout from "./Layout";
import Space from "./Pages/Space";

function App() {
	return (
		<>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route path="/signup" element={<Signup />} />
						<Route path="/signin" element={<Signin />} />
						<Route path="/home" element={<Home />} />
						<Route path="/space/:roomId" element={<Space />} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</>
	);
}

export default App;
