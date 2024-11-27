"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const v1_1 = require("./v1");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ credentials: true, origin: ["http://localhost:5173"] }));
app.use(express_1.default.json());
app.use("/api/v1", v1_1.router);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
