"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const inversify_1 = require("inversify");
const lodash_1 = __importDefault(require("lodash"));
const Article_1 = require("../models/Article");
const Media_1 = require("../models/Media");
const Engagement_1 = require("../models/Engagement");
let ArticleService = class ArticleService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, content, category, creator, status, media } = data;
            const existingArticle = yield Article_1.ArticleModel.findOne({ title });
            if (existingArticle)
                throw new Error('Article already created');
            const article = new Article_1.ArticleModel(lodash_1.default.pickBy({ title, content, creator, category, status }));
            for (let i = 0; i < media.length; i++) {
                const item = data.media[i];
                const file = new Media_1.MediaModel(lodash_1.default.pickBy(Object.assign(Object.assign({}, item), { article: article._id, title: article.title })));
                yield file.save();
            }
            yield article.save();
            const engagement = new Engagement_1.EngagementModel({ article: article._id, likes: [], comments: [] });
            engagement.save();
            yield article.populate([
                { path: 'category' },
                { path: 'creator' },
                { path: 'media' },
                { path: 'engagement', populate: [{ path: 'likes.user' }, { path: 'comments.user' }] },
            ]);
            return article;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, content, category, creator, status, media, deletedMedia } = data;
            const existingArticle = yield Article_1.ArticleModel.findById(id);
            if (!existingArticle)
                throw new Error('Article not found');
            const article = yield Article_1.ArticleModel.findByIdAndUpdate(id, lodash_1.default.pickBy({ title, content, creator, category, status }), { new: true, runValidators: true });
            if (media.length) {
                for (let i = 0; i < media.length; i++) {
                    const item = media[i];
                    const file = new Media_1.MediaModel(lodash_1.default.pickBy(Object.assign(Object.assign({}, item), { article: article._id, title: article.title })));
                    yield file.save();
                }
            }
            if (deletedMedia.length)
                yield Media_1.MediaModel.deleteMany({ _id: { $in: deletedMedia } });
            yield article.populate([
                { path: 'category' },
                { path: 'creator' },
                { path: 'media' },
                { path: 'engagement', populate: [{ path: 'likes.user' }, { path: 'comments.user' }] },
            ]);
            return article;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield Article_1.ArticleModel.findById(id);
            if (!article)
                throw new Error('Article not found');
            yield article.populate([
                { path: 'creator' },
                { path: 'category' },
                { path: 'media' },
                { path: 'engagement', populate: [{ path: 'likes.user' }, { path: 'comments.user' }] },
            ]);
            return article;
        });
    }
    page(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield Article_1.ArticleModel.paginate(query, options);
            return page;
        });
    }
    delete(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield Article_1.ArticleModel.findById(articleId);
            if (!article)
                throw new Error('Article not found');
            yield Article_1.ArticleModel.findByIdAndDelete(articleId);
            yield Media_1.MediaModel.deleteMany({ article: articleId });
            return article;
        });
    }
};
ArticleService = __decorate([
    (0, inversify_1.injectable)()
], ArticleService);
exports.ArticleService = ArticleService;
//# sourceMappingURL=article.js.map