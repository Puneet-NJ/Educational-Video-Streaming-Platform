import express from "express";
import { router } from "./v1/index.js";
import cors from "cors";

const app = express();

app.use(cors({ credentials: true, origin: ["http://localhost:5173"] }));
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req, res) => {
	res.json({ msg: "Unacademy Server Healthy" });
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
