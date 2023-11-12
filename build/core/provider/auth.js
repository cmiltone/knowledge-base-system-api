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
exports.AuthProvider = exports.Principal = void 0;
const inversify_1 = require("inversify");
const user_1 = require("../../services/user");
const token_1 = require("../../services/token");
class Principal {
    constructor(details) {
        this.details = details;
    }
    isAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            return !!this.details && this.details.status === 'active';
        });
    }
    isResourceOwner(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.details && resource.type === 'user')
                return resource.id === this.details._id;
            return false;
        });
    }
    isInRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!this.details && this.details.role === role;
        });
    }
    hasPermission(roles) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!this.details && roles.some((role) => role === this.details.role);
        });
    }
}
exports.Principal = Principal;
let AuthProvider = class AuthProvider {
    getUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            try {
                if (req.headers.authorization) {
                    const token = req.headers.authorization.split(' ')[1];
                    if (token) {
                        const decodedUser = yield this.tokenService.decode(token);
                        user = yield this.userService.findById(decodedUser._id);
                        user = Object.assign(Object.assign({}, decodedUser), user);
                    }
                }
            }
            catch (error) {
                console.error('auth %o', error.message);
            }
            if (user)
                console.debug('auth id: %o name: %o email: %o', user._id, user.fullName, user.email);
            return new Principal(user);
        });
    }
};
__decorate([
    (0, inversify_1.inject)(user_1.UserService),
    __metadata("design:type", user_1.UserService)
], AuthProvider.prototype, "userService", void 0);
__decorate([
    (0, inversify_1.inject)(token_1.TokenService),
    __metadata("design:type", token_1.TokenService)
], AuthProvider.prototype, "tokenService", void 0);
AuthProvider = __decorate([
    (0, inversify_1.injectable)()
], AuthProvider);
exports.AuthProvider = AuthProvider;
//# sourceMappingURL=auth.js.map