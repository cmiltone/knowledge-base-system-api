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
exports.ArticleController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const celebrate_1 = require("celebrate");
const article_1 = require("../../services/article");
const auth_1 = require("../middlewares/auth");
const celebrate_2 = require("../../util/celebrate");
const upload_1 = require("../middlewares/upload");
const multer_1 = require("../../config/multer");
let ArticleController = class ArticleController extends inversify_express_utils_1.BaseHttpController {
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, content, creator, category, status, files } = this.httpContext.request.body;
            const result = yield this.articleService.create({ title, content, creator, category, status, media: files });
            this.httpContext.response.json(result);
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const { articleId, title, content, creator, category, status, files, deletedMedia } = this.httpContext.request.body;
            let dm = [];
            if (deletedMedia !== '')
                dm = deletedMedia.split(',');
            const result = yield this.articleService.update(articleId, { title, content, creator, category, status, media: files, deletedMedia: dm });
            this.httpContext.response.json(result);
        });
    }
    page() {
        return __awaiter(this, void 0, void 0, function* () {
            const { articleId, limit, page, q, sort, status, categoryId, userId } = this.httpContext.request.query;
            if (articleId) {
                const article = yield this.articleService.findById(articleId);
                this.httpContext.response.json(article);
                return;
            }
            const query = {};
            const options = {
                limit: +limit,
                page: +page,
                lean: true,
                sort: sort,
                populate: [
                    { path: 'creator' },
                    { path: 'category' },
                    { path: 'media' },
                    { path: 'engagement', populate: [{ path: 'likes.user' }, { path: 'comments.user' }] }
                ]
            };
            if (q) {
                query['$text'] = { $search: q };
            }
            if (status) {
                query['status'] = status;
            }
            if (categoryId) {
                query['category'] = categoryId;
            }
            if (userId) {
                query['creator'] = userId;
            }
            const pageResult = yield this.articleService.page(query, options);
            this.httpContext.response.json(pageResult);
        });
    }
};
__decorate([
    (0, inversify_1.inject)(article_1.ArticleService),
    __metadata("design:type", article_1.ArticleService)
], ArticleController.prototype, "articleService", void 0);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/', auth_1.AuthMiddleware, (0, upload_1.upload)({ filePath: multer_1.FILE_PATH, fileName: 'files', count: 4 }), upload_1.UploadMiddleware, (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            title: celebrate_1.Joi.string().required(),
            content: celebrate_1.Joi.string().required(),
            creator: celebrate_1.Joi.string().required(),
            category: celebrate_1.Joi.string().required(),
            status: celebrate_1.Joi.string().equal('published', 'draft', 'deleted').required(),
            files: celebrate_1.Joi.array().items(celebrate_2.fileJoi).max(4),
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "create", null);
__decorate([
    (0, inversify_express_utils_1.httpPut)('/', auth_1.AuthMiddleware, (0, upload_1.upload)({ filePath: multer_1.FILE_PATH, fileName: 'files', count: 4 }), upload_1.UploadMiddleware, (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            articleId: celebrate_1.Joi.string().required(),
            title: celebrate_1.Joi.string(),
            content: celebrate_1.Joi.string(),
            creator: celebrate_1.Joi.string(),
            category: celebrate_1.Joi.string(),
            status: celebrate_1.Joi.string().equal('published', 'draft', 'deleted'),
            files: celebrate_1.Joi.array().items(celebrate_2.fileJoi).max(4),
            deletedMedia: celebrate_1.Joi.string().allow('')
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "update", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/', auth_1.AuthMiddleware, (0, celebrate_1.celebrate)({
        query: celebrate_1.Joi.object({
            articleId: celebrate_1.Joi.string(),
            limit: celebrate_1.Joi.number().default(10),
            page: celebrate_1.Joi.number().default(1),
            q: celebrate_1.Joi.string(),
            sort: celebrate_1.Joi.string().equal('createdAt', 'updatedAt', 'title').default('-createdAt'),
            status: celebrate_1.Joi.string(),
            categoryId: celebrate_1.Joi.string(),
            userId: celebrate_1.Joi.string(),
        })
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "page", null);
ArticleController = __decorate([
    (0, inversify_express_utils_1.controller)('/v1/article')
], ArticleController);
exports.ArticleController = ArticleController;
//# sourceMappingURL=article.js.map