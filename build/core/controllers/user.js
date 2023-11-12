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
exports.UserController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const celebrate_1 = require("celebrate");
const user_1 = require("../../services/user");
const auth_1 = require("../middlewares/auth");
let UserController = class UserController extends inversify_express_utils_1.BaseHttpController {
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, fullName, status, role } = this.httpContext.request.body;
            const result = yield this.userService.update(userId, { fullName, status, role });
            this.httpContext.response.json(result);
        });
    }
    page() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, limit, page, q, sort, status } = this.httpContext.request.query;
            if (userId) {
                const user = yield this.userService.findById(userId);
                this.httpContext.response.json(user);
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
            const pageResult = yield this.userService.page(query, options);
            this.httpContext.response.json(pageResult);
        });
    }
    deleteUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = this.httpContext.request.params;
            const user = yield this.userService.delete(userId);
            this.httpContext.response.json(user);
        });
    }
};
__decorate([
    (0, inversify_1.inject)(user_1.UserService),
    __metadata("design:type", user_1.UserService)
], UserController.prototype, "userService", void 0);
__decorate([
    (0, inversify_express_utils_1.httpPut)('/', auth_1.Auth2Middleware, (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            userId: celebrate_1.Joi.string().required(),
            fullName: celebrate_1.Joi.string(),
            role: celebrate_1.Joi.string().equal('user', 'admin', 'creator'),
            status: celebrate_1.Joi.string().equal('active', 'inactive', 'blocked'),
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/', auth_1.Auth2Middleware, (0, celebrate_1.celebrate)({
        query: celebrate_1.Joi.object({
            userId: celebrate_1.Joi.string(),
            limit: celebrate_1.Joi.number().default(10),
            page: celebrate_1.Joi.number().default(1),
            q: celebrate_1.Joi.string(),
            sort: celebrate_1.Joi.string().equal('createdAt', 'updatedAt', 'fullName').default('-createdAt'),
            status: celebrate_1.Joi.string(),
        })
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "page", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)('/:userId', auth_1.AuthMiddleware, (0, celebrate_1.celebrate)({
        params: celebrate_1.Joi.object({
            userId: celebrate_1.Joi.string().required()
        })
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
UserController = __decorate([
    (0, inversify_express_utils_1.controller)('/v1/user')
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.js.map