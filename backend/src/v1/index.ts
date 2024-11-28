import { Router } from "express";
import { userRouter } from "./user";
import dotenv from "dotenv";
import { roomRouter } from "./room";

dotenv.config();

export const router = Router();

router.use("/user", userRouter);
router.use("/room", roomRouter);
