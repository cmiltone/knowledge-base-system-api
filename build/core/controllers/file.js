"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const path_1 = require("path");
const multer_1 = require("../../config/multer");
const celebrate_1 = require("celebrate");
let FileController = class FileController extends inversify_express_utils_1.BaseHttpController {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { request: { params: { filename }, }, response, } = this.httpContext;
            yield new Promise(() => {
                response.sendFile(`${(0, path_1.resolve)(multer_1.FILE_PATH)}/${filename}`);
            });
        });
    }
};
__decorate([
    (0, inversify_express_utils_1.httpGet)('/:filename', (0, celebrate_1.celebrate)({
        query: celebrate_1.Joi.object().empty(),
        body: celebrate_1.Joi.object().empty(),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FileController.prototype, "get", null);
FileController = __decorate([
    (0, inversify_express_utils_1.controller)('/v1/file')
], FileController);
exports.FileController = FileController;
//# sourceMappingURL=file.js.map