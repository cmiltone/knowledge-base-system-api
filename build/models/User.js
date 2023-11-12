"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: true,
        es_indexed: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        es_indexed: true,
    },
    phoneNumber: { type: String, required: true, unique: true },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'creator', 'admin'],
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'blocked', 'inactive'],
    },
    password: { type: String, required: true, select: false },
}, { timestamps: true });
userSchema.plugin(mongoose_paginate_v2_1.default);
userSchema.index({ fullName: 'text', email: 'text' });
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=User.js.map