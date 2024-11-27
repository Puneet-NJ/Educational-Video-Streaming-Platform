"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_1 = require("./user");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.router = (0, express_1.Router)();
exports.router.use("/user", user_1.userRouter);
