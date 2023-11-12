"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileSchema = void 0;
const mongoose_1 = require("mongoose");
exports.fileSchema = new mongoose_1.Schema({
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
}, { timestamps: false, _id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } });
//# sourceMappingURL=file.js.map