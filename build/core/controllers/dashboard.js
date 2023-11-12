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
exports.DashboardController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const celebrate_1 = require("celebrate");
const article_1 = require("../../services/article");
const auth_1 = require("../middlewares/auth");
const category_1 = require("../../services/category");
let DashboardController = class DashboardController extends inversify_express_utils_1.BaseHttpController {
    summarize() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = this.httpContext.request.query;
            const articleQuery = {};
            const categoryQuery = {};
            articleQuery['status'] = 'published';
            categoryQuery['status'] = 'active';
            if (userId) {
                articleQuery['creator'] = userId;
                const articlePage = yield this.articleService.page(articleQuery, {});
                const categoryPage = yield this.categoryService.page(categoryQuery, {});
                this.httpContext.response.json({
                    totalArticles: articlePage.totalDocs,
                    totalCategories: categoryPage.totalDocs
                });
                return;
            }
            const articlePage = yield this.articleService.page(articleQuery, {});
            const categoryPage = yield this.categoryService.page(categoryQuery, {});
            this.httpContext.response.json({
                totalArticles: articlePage.totalDocs,
                totalCategories: categoryPage.totalDocs
            });
        });
    }
};
__decorate([
    (0, inversify_1.inject)(article_1.ArticleService),
    __metadata("design:type", article_1.ArticleService)
], DashboardController.prototype, "articleService", void 0);
__decorate([
    (0, inversify_1.inject)(category_1.CategoryService),
    __metadata("design:type", category_1.CategoryService)
], DashboardController.prototype, "categoryService", void 0);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/', auth_1.AuthMiddleware, (0, celebrate_1.celebrate)({
        query: celebrate_1.Joi.object({
            userId: celebrate_1.Joi.string(),
        })
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "summarize", null);
DashboardController = __decorate([
    (0, inversify_express_utils_1.controller)('/v1/dashboard-summary')
], DashboardController);
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.js.map