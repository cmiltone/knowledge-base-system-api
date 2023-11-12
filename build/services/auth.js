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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const inversify_1 = require("inversify");
const token_1 = require("./token");
const User_1 = require("../models/User");
const argon2_1 = __importDefault(require("argon2"));
let AuthService = class AuthService {
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullName, email, phoneNumber, password } = data;
            const existingUser = yield User_1.UserModel.findOne({ $or: [{ email }, { phoneNumber }] });
            if (existingUser)
                throw new Error('User already registered');
            const hash = yield argon2_1.default.hash(password);
            const user = new User_1.UserModel({ phoneNumber, email, fullName, password: hash });
            yield user.save();
            user.password = undefined;
            const token = this.tokenService.encode({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                status: user.status
            });
            return { user: user, token };
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { identifier, password } = data;
            const user = yield User_1.UserModel
                .findOne({ $or: [{ email: identifier }, { phoneNumber: identifier }] })
                .select({ password: 1, email: 1, _id: 1, fullName: 1, role: 1, status: 1, phoneNumber: 1 });
            if (!user)
                throw new Error('User not registered');
            const correct = yield argon2_1.default.verify(user.password, password);
            // delete user.password;
            user.password = undefined;
            if (!correct)
                throw new Error('Password incorrect');
            const token = this.tokenService.encode({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                status: user.status,
                role: user.role
            });
            return { user, token };
        });
    }
};
__decorate([
    (0, inversify_1.inject)(token_1.TokenService),
    __metadata("design:type", token_1.TokenService)
], AuthService.prototype, "tokenService", void 0);
AuthService = __decorate([
    (0, inversify_1.injectable)()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.js.map