"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const config = dotenv_1.default.config();
if (config.error)
    throw new Error('Could not find .env file');
//# sourceMappingURL=index.js.map