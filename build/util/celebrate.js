"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileJoi = void 0;
const celebrate_1 = require("celebrate");
exports.fileJoi = celebrate_1.Joi.object({
    ext: celebrate_1.Joi.string(),
    mime: celebrate_1.Joi.string(),
    type: celebrate_1.Joi.string().allow('image', 'video'),
    thumbnail: celebrate_1.Joi.string(),
    filename: celebrate_1.Joi.string(),
    size: celebrate_1.Joi.number(),
    dimensions: celebrate_1.Joi.object({
        height: celebrate_1.Joi.number(),
        width: celebrate_1.Joi.number(),
        orientation: celebrate_1.Joi.number(),
    }),
});
//# sourceMappingURL=celebrate.js.map