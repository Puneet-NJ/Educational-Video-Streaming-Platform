import express from "express";
import { userRouter } from "./user.js";
import dotenv from "dotenv";
import { roomRouter } from "./room.js";
import { slidesRouter } from "./slides.js";

dotenv.config();

const router = express.Router();

router.use("/user", userRouter);
router.use("/room", roomRouter);
router.use("/slides", slidesRouter);

export { router };
