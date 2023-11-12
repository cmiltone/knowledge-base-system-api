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
exports.PermitDefaultMiddleware = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
let PermitDefaultMiddleware = class PermitDefaultMiddleware extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const principal = this.httpContext.user;
                const permitted = yield principal.hasPermission(['user']);
                if (permitted)
                    return next();
                throw new Error('You do not have permissions to access this resource. [default]');
            }
            catch (error) {
                error.code = '403';
                error.status = 403;
                next(error);
            }
        });
    }
};
PermitDefaultMiddleware = __decorate([
    (0, inversify_1.injectable)()
], PermitDefaultMiddleware);
exports.PermitDefaultMiddleware = PermitDefaultMiddleware;
//# sourceMappingURL=permission.js.map