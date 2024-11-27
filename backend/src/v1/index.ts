import { Router } from "express";
import { userRouter } from "./user";
import dotenv from "dotenv";

dotenv.config();

export const router = Router();

router.use("/user", userRouter);
