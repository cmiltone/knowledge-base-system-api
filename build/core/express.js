"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.notFoundErrorMiddleware = exports.configureApp = void 0;
const express_1 = __importDefault(require("express"));
// import morganBody from 'morgan-body';
const serialize_error_1 = require("serialize-error");
const server_1 = require("../config/server");
const celebrate_1 = require("celebrate");
const cors_1 = __importDefault(require("cors"));
function configureApp(app) {
    app.enable('trust proxy');
    app.use((0, cors_1.default)({
        allowedHeaders: ['Authorization', 'Content-Type'],
        exposedHeaders: ['Authorization'],
    }));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: false }));
    // morganBody(app, { maxBodyLength: 100 });
}
exports.configureApp = configureApp;
function notFoundErrorMiddleware(app) {
    app.use((req, res, next) => {
        const error = new Error('URL not found');
        error.code = '404';
        error.status = 404;
        next(error);
    });
}
exports.notFoundErrorMiddleware = notFoundErrorMiddleware;
function errorMiddleware(app) {
    app.use((error, req, res, next) => {
        const { name, stack, code, message, status } = error;
        const serializedError = (0, serialize_error_1.serializeError)({ name, stack, code, status, message });
        serializedError.code = serializedError.code || '500';
        delete serializedError.status;
        if ((0, celebrate_1.isCelebrateError)(error))
            serializedError.message = error.details.entries().next().value[1].details[0].message;
        if (server_1.NODE_ENV !== 'development')
            delete serializedError.stack;
        res.status(error.status || 500).json({ error: serializedError });
        next();
    });
}
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=express.js.map