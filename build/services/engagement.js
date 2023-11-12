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
exports.EngagementService = void 0;
const inversify_1 = require("inversify");
const lodash_1 = __importDefault(require("lodash"));
const Engagement_1 = require("../models/Engagement");
let EngagementService = class EngagementService {
    create(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { article, likes, comments } = data;
            if (likes === null || likes === void 0 ? void 0 : likes.length) {
                const existingEngagement = yield Engagement_1.EngagementModel.findOne({ article, 'likes.user': { $in: likes.map((like) => like.user) } });
                if (existingEngagement)
                    throw new Error('Already liked');
            }
            const engagement = yield Engagement_1.EngagementModel.findOneAndUpdate({ article }, {
                $push: {
                    likes: (_a = likes === null || likes === void 0 ? void 0 : likes.map((like) => (Object.assign(Object.assign({}, like), { updatedAt: Date.now() })))) !== null && _a !== void 0 ? _a : [],
                    comments: (_b = comments === null || comments === void 0 ? void 0 : comments.map((comment) => (Object.assign(Object.assign({}, comment), { updatedAt: Date.now() })))) !== null && _b !== void 0 ? _b : [],
                }
            }, { new: true, runValidators: true });
            if (!engagement)
                throw new Error('Engagement Not Found');
            return engagement;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingEngagement = yield Engagement_1.EngagementModel.findById(id);
            if (!existingEngagement)
                throw new Error('Engagement not found');
            const { comment } = data;
            const idx = existingEngagement.comments.findIndex((item) => item._id === comment.id);
            if (idx > -1) {
                existingEngagement.comments[idx].message = comment.message;
                existingEngagement.comments[idx].updatedAt = new Date();
                existingEngagement.save();
            }
            const engagement = yield Engagement_1.EngagementModel.findByIdAndUpdate(id, lodash_1.default.pickBy(data), { new: true, runValidators: true });
            return engagement;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const engagement = yield Engagement_1.EngagementModel.findById(id);
            if (!engagement)
                throw new Error('Engagement not found');
            return engagement;
        });
    }
    page(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield Engagement_1.EngagementModel.paginate(query, options);
            return page;
        });
    }
    deleteLikesOrComment(id, data) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const existingEngagement = yield Engagement_1.EngagementModel.findById(id);
            if (!existingEngagement)
                throw new Error('Engagement not found');
            const { likes, comments } = data;
            const _likes = (_b = (_a = existingEngagement.likes) === null || _a === void 0 ? void 0 : _a.filter((item) => !likes.includes(item._id))) !== null && _b !== void 0 ? _b : [];
            const _comments = (_d = (_c = existingEngagement.comments) === null || _c === void 0 ? void 0 : _c.filter((item) => !comments.includes(item._id))) !== null && _d !== void 0 ? _d : [];
            const engagement = yield Engagement_1.EngagementModel.findByIdAndUpdate(id, { likes: _likes, comments: _comments }, { new: true, runValidators: true });
            return engagement;
        });
    }
};
EngagementService = __decorate([
    (0, inversify_1.injectable)()
], EngagementService);
exports.EngagementService = EngagementService;
//# sourceMappingURL=engagement.js.map