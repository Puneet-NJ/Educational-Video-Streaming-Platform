import express from "express";
import { router } from "./v1/index.js";
import cors from "cors";

const app = express();

app.use(cors({ credentials: true, origin: ["http://localhost:5175"] }));
app.use(express.json());

app.use("/api/v1", router);

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
