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
exports.EngagementController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const celebrate_1 = require("celebrate");
const engagement_1 = require("../../services/engagement");
const auth_1 = require("../middlewares/auth");
let EngagementController = class EngagementController extends inversify_express_utils_1.BaseHttpController {
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const { articleId, likes, comments } = this.httpContext.request.body;
            const result = yield this.engagementService.create({ article: articleId, likes, comments });
            this.httpContext.response.json(result);
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const { engagementId, comment } = this.httpContext.request.body;
            const result = yield this.engagementService.update(engagementId, { comment });
            this.httpContext.response.json(result);
        });
    }
    page() {
        return __awaiter(this, void 0, void 0, function* () {
            const { engagementId, limit, page, sort } = this.httpContext.request.query;
            if (engagementId) {
                const engagement = yield this.engagementService.findById(engagementId);
                this.httpContext.response.json(engagement);
                return;
            }
            const query = {};
            const options = {
                limit: +limit,
                page: +page,
                lean: true,
                sort: sort,
            };
            const pageResult = yield this.engagementService.page(query, options);
            this.httpContext.response.json(pageResult);
        });
    }
};
__decorate([
    (0, inversify_1.inject)(engagement_1.EngagementService),
    __metadata("design:type", engagement_1.EngagementService)
], EngagementController.prototype, "engagementService", void 0);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/', auth_1.AuthMiddleware, (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            articleId: celebrate_1.Joi.string().required(),
            likes: celebrate_1.Joi.array().items(celebrate_1.Joi.object({
                user: celebrate_1.Joi.string().required(),
            })),
            comments: celebrate_1.Joi.array().items(celebrate_1.Joi.object({
                user: celebrate_1.Joi.string().required(),
                message: celebrate_1.Joi.string().required()
            })),
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EngagementController.prototype, "create", null);
__decorate([
    (0, inversify_express_utils_1.httpPut)('/', auth_1.AuthMiddleware, (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            engagementId: celebrate_1.Joi.string().required(),
            comment: celebrate_1.Joi.array().items(celebrate_1.Joi.object({
                id: celebrate_1.Joi.string().required(),
                message: celebrate_1.Joi.string().required()
            })).required(),
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EngagementController.prototype, "update", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/', auth_1.AuthMiddleware, (0, celebrate_1.celebrate)({
        query: celebrate_1.Joi.object({
            engagementId: celebrate_1.Joi.string(),
            limit: celebrate_1.Joi.number().default(10),
            page: celebrate_1.Joi.number().default(1),
            sort: celebrate_1.Joi.string().equal('createdAt', 'updatedAt').default('-createdAt'),
            status: celebrate_1.Joi.string(),
        })
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EngagementController.prototype, "page", null);
EngagementController = __decorate([
    (0, inversify_express_utils_1.controller)('/v1/engagement')
], EngagementController);
exports.EngagementController = EngagementController;
//# sourceMappingURL=engagment.js.map