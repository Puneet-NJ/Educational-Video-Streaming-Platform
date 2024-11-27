"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVar = void 0;
// src/utils/env.ts
function getEnvVar(key) {
    const value = process.env[key];
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}
exports.getEnvVar = getEnvVar;
// Usage example
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// In your main file or other files
const PORT = getEnvVar("PORT");
const DATABASE_URL = getEnvVar("DATABASE_URL");
const JWT_SECRET = getEnvVar("JWT_SECRET");
