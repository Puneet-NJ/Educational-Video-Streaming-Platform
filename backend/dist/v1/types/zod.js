"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSigninSchema = exports.userSignupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userSignupSchema = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string(),
    role: zod_1.default.enum(["Student", "Teacher", "Admin"]),
});
exports.userSigninSchema = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string(),
});
