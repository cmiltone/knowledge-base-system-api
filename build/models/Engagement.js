"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngagementModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const likeSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
const commentSchema = new mongoose_1.Schema({
    message: { type: String, required: true },
    user: {
        type: mongoose_1.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
commentSchema.add({
    replies: [commentSchema],
});
const engagementSchema = new mongoose_1.Schema({
    article: {
        type: mongoose_1.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: [likeSchema],
    comments: [commentSchema],
}, { timestamps: true });
engagementSchema.plugin(mongoose_paginate_v2_1.default);
exports.EngagementModel = (0, mongoose_1.model)('Engagement', engagementSchema);
//# sourceMappingURL=Engagement.js.map