"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const mediaSchema = new mongoose_1.Schema({
    title: { type: String, required: false },
    article: { type: mongoose_1.Schema.ObjectId, ref: 'Article' },
    ext: { type: String },
    mime: { type: String },
    type: { type: String, enum: ['image', 'video'] },
    thumbnail: { type: String },
    filename: { type: String },
    size: { type: Number },
    dimensions: {
        type: new mongoose_1.Schema({
            height: { type: Number, required: true },
            width: { type: Number, required: true },
            orientation: { type: Number, required: true },
        }, { _id: false }),
    },
}, { timestamps: true });
mediaSchema.plugin(mongoose_paginate_v2_1.default);
mediaSchema.index({ title: 'text' });
exports.MediaModel = (0, mongoose_1.model)('Media', mediaSchema);
//# sourceMappingURL=Media.js.map