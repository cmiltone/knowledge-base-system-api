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
exports.AuthController = void 0;
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const celebrate_1 = require("celebrate");
const auth_1 = require("../../services/auth");
let AuthController = class AuthController extends inversify_express_utils_1.BaseHttpController {
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            const { identifier, password } = this.httpContext.request.body;
            const result = yield this.authService.login({ identifier, password });
            this.httpContext.response.json(result);
        });
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullName, phoneNumber, email, password } = this.httpContext.request.body;
            const result = yield this.authService.register({ fullName, email, phoneNumber, password });
            this.httpContext.response.json(result);
        });
    }
};
__decorate([
    (0, inversify_1.inject)(auth_1.AuthService),
    __metadata("design:type", auth_1.AuthService)
], AuthController.prototype, "authService", void 0);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/login', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            identifier: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required(),
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/register', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            fullName: celebrate_1.Joi.string().required(),
            phoneNumber: celebrate_1.Joi.string().required(),
            email: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required(),
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
AuthController = __decorate([
    (0, inversify_express_utils_1.controller)('/v1/auth')
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.js.map