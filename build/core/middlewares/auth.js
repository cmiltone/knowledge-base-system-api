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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth2Middleware = exports.AuthMiddleware = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
let AuthMiddleware = class AuthMiddleware extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const principal = this.httpContext.user;
                if (principal.details && principal.details.status === 'blocked')
                    throw new Error('You have been blocked. Contact admin');
                if (principal.details && principal.details.status === 'inactive')
                    throw new Error('Your account is inactive. Contact admin');
                if (yield principal.isAuthenticated())
                    return next();
                throw new Error('Authentication failed');
            }
            catch (error) {
                error.code = '401';
                error.status = 401;
                next(error);
            }
        });
    }
};
AuthMiddleware = __decorate([
    (0, inversify_1.injectable)()
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
let Auth2Middleware = class Auth2Middleware extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const principal = this.httpContext.user;
                if (principal.details && principal.details.status === 'blocked')
                    throw new Error('You have been blocked. Contact admin');
                const isAdmin = yield principal.isInRole('admin');
                if (!isAdmin)
                    throw new Error('You do not have permission to access this resource');
                if (yield principal.isAuthenticated())
                    return next();
                throw new Error('Authentication failed');
            }
            catch (error) {
                error.code = '401';
                error.status = 401;
                next(error);
            }
        });
    }
};
Auth2Middleware = __decorate([
    (0, inversify_1.injectable)()
], Auth2Middleware);
exports.Auth2Middleware = Auth2Middleware;
//# sourceMappingURL=auth.js.map