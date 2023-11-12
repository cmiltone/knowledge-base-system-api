"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContainer = void 0;
const inversify_1 = require("inversify");
const auth_1 = require("./middlewares/auth");
const auth_2 = require("../services/auth");
const token_1 = require("../services/token");
const user_1 = require("../services/user");
const article_1 = require("../services/article");
const category_1 = require("../services/category");
const upload_1 = require("./middlewares/upload");
const engagement_1 = require("../services/engagement");
function getContainer() {
    const container = new inversify_1.Container({ skipBaseClassChecks: true });
    container.bind(auth_1.AuthMiddleware).to(auth_1.AuthMiddleware);
    container.bind(auth_1.Auth2Middleware).to(auth_1.Auth2Middleware);
    container.bind(auth_2.AuthService).to(auth_2.AuthService);
    container.bind(token_1.TokenService).to(token_1.TokenService);
    container.bind(user_1.UserService).to(user_1.UserService);
    container.bind(article_1.ArticleService).to(article_1.ArticleService);
    container.bind(category_1.CategoryService).to(category_1.CategoryService);
    container.bind(upload_1.UploadMiddleware).to(upload_1.UploadMiddleware);
    container.bind(engagement_1.EngagementService).to(engagement_1.EngagementService);
    return container;
}
exports.getContainer = getContainer;
//# sourceMappingURL=container.js.map