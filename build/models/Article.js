"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
// import { MediaModel } from './Media';
const articleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        es_indexed: true,
    },
    content: { type: String, required: true },
    creator: {
        type: mongoose_1.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: mongoose_1.Schema.ObjectId,
        ref: 'Category',
        required: true,
    },
    status: {
        type: String,
        default: 'draft',
        enum: ['published', 'draft', 'deleted'],
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});
articleSchema.index({ title: 'text', content: 'text' });
articleSchema.plugin(mongoose_paginate_v2_1.default);
articleSchema.virtual('media', {
    ref: 'Media',
    localField: '_id',
    foreignField: 'article',
    justOne: false,
});
articleSchema.virtual('engagement', {
    ref: 'Engagement',
    localField: '_id',
    foreignField: 'article',
    justOne: true,
});
exports.ArticleModel = (0, mongoose_1.model)('Article', articleSchema);
//# sourceMappingURL=Article.js.map