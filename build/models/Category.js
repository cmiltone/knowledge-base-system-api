"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        es_indexed: true,
    },
    description: { type: String, required: true },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive'],
    },
}, { timestamps: true });
categorySchema.plugin(mongoose_paginate_v2_1.default);
categorySchema.index({ name: 'text', description: 'text' });
exports.CategoryModel = (0, mongoose_1.model)('Category', categorySchema);
//# sourceMappingURL=Category.js.map