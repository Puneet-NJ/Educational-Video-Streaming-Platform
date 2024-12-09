import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Check from "./Pages/Check";
import Space from "./Pages/Space";
import Layout from "./Layout";
import Host from "./Pages/Host";

function App() {
	return (
		<>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route path="/signin" element={<Signin />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/home" element={<Home />} />
						<Route path="/check" element={<Check />} />

						<Route path="/host" element={<Host />} />
						{/* <Route path="/watch" element={<Host />} /> */}
						<Route path="/watch/:roomId" element={<Space />} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</>
	);
}

export default App;
