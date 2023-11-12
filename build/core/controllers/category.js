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
exports.CategoryController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const celebrate_1 = require("celebrate");
const category_1 = require("../../services/category");
const auth_1 = require("../middlewares/auth");
let CategoryController = class CategoryController extends inversify_express_utils_1.BaseHttpController {
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description } = this.httpContext.request.body;
            const result = yield this.categoryService.create({ name, description });
            this.httpContext.response.json(result);
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryId, name, description, status } = this.httpContext.request.body;
            const result = yield this.categoryService.update(categoryId, { name, description, status });
            this.httpContext.response.json(result);
        });
    }
    page() {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryId, limit, page, q, sort, status } = this.httpContext.request.query;
            if (categoryId) {
                const category = yield this.categoryService.findById(categoryId);
                this.httpContext.response.json(category);
                return;
            }
            const query = {};
            const options = {
                limit: +limit,
                page: +page,
                lean: true,
                sort: sort,
            };
            if (q) {
                query['$text'] = { $search: q };
            }
            if (status) {
                query['status'] = status;
            }
            const pageResult = yield this.categoryService.page(query, options);
            this.httpContext.response.json(pageResult);
        });
    }
};
__decorate([
    (0, inversify_1.inject)(category_1.CategoryService),
    __metadata("design:type", category_1.CategoryService)
], CategoryController.prototype, "categoryService", void 0);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/', auth_1.AuthMiddleware, (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            name: celebrate_1.Joi.string().required(),
            description: celebrate_1.Joi.string().required(),
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "create", null);
__decorate([
    (0, inversify_express_utils_1.httpPut)('/', auth_1.AuthMiddleware, (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            categoryId: celebrate_1.Joi.string().required(),
            name: celebrate_1.Joi.string(),
            description: celebrate_1.Joi.string(),
            status: celebrate_1.Joi.string().equal('active', 'inactive'),
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "update", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/', auth_1.AuthMiddleware, (0, celebrate_1.celebrate)({
        query: celebrate_1.Joi.object({
            categoryId: celebrate_1.Joi.string(),
            limit: celebrate_1.Joi.number().default(10),
            page: celebrate_1.Joi.number().default(1),
            q: celebrate_1.Joi.string(),
            sort: celebrate_1.Joi.string().equal('createdAt', 'updatedAt', 'name').default('-createdAt'),
            status: celebrate_1.Joi.string(),
        })
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "page", null);
CategoryController = __decorate([
    (0, inversify_express_utils_1.controller)('/v1/category')
], CategoryController);
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.js.map