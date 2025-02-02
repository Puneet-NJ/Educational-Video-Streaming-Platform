import express from "express";
import { userRouter } from "./routes/user.js";
import dotenv from "dotenv";
import { roomRouter } from "./routes/room.js";
import { slidesRouter } from "./routes/slides.js";

dotenv.config();

const router = express.Router();

router.use("/user", userRouter);
router.use("/room", roomRouter);
router.use("/slides", slidesRouter);

export { router };
