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
exports.UserService = void 0;
const inversify_1 = require("inversify");
const lodash_1 = __importDefault(require("lodash"));
const User_1 = require("../models/User");
let UserService = class UserService {
    update(userId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.UserModel.findById(userId);
            if (!user)
                throw new Error('User not found');
            const updatedUser = yield User_1.UserModel.findByIdAndUpdate(userId, lodash_1.default.pickBy(update), { new: true, runValidators: true });
            return updatedUser;
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.UserModel.findById(userId);
            if (!user)
                throw new Error('User not found');
            return user;
        });
    }
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.UserModel.findById(userId);
            if (!user)
                throw new Error('User not found');
            yield User_1.UserModel.findByIdAndDelete(userId);
            return user;
        });
    }
    page(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield User_1.UserModel.paginate(query, options);
            return page;
        });
    }
};
UserService = __decorate([
    (0, inversify_1.injectable)()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.js.map