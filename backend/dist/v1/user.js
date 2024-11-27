"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const zod_1 = require("./types/zod");
const lib_1 = require("./utils/lib");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(process.env.JWT_SECRET);
        const validateInput = zod_1.userSignupSchema.safeParse(req.body);
        if (!validateInput.success) {
            res.status(411).json({ msg: "Invalid inputs" });
            return;
        }
        const username = validateInput.data.username;
        const password = validateInput.data.password;
        const role = validateInput.data.role;
        const userExists = yield lib_1.client.user.findFirst({ where: { username } });
        if (userExists) {
            res.status(409).json({ msg: "Username already exists" });
            return;
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const user = yield lib_1.client.user.create({
            data: {
                username,
                password: hashedPassword,
                role,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET);
        res.json({ msg: "Sign up successful", token });
    }
    catch (err) {
        res.status(500).json({ msg: "Internal server error" });
    }
}));
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateInput = zod_1.userSigninSchema.safeParse(req.body);
        if (!validateInput.success) {
            res.status(403).json({ msg: "Invalid inputs" });
            return;
        }
        const username = validateInput.data.username;
        const password = validateInput.data.password;
        const user = yield lib_1.client.user.findFirst({
            where: { username },
        });
        if (!user) {
            res.status(401).json({ msg: "Username doesn't exists" });
            return;
        }
        const isPasswordMatching = yield (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordMatching) {
            res.status(401).json({ msg: "Password doesn't match" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET);
        res.json({ msg: "Sign in successful", token });
    }
    catch (err) {
        res.status(500).json({ msg: "Internal server error" });
    }
}));
