"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.upload = exports.UploadMiddleware = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const multer = __importStar(require("multer"));
const path_1 = require("path");
const mkdirp_1 = __importDefault(require("mkdirp"));
const image_size_1 = __importDefault(require("image-size"));
const file_type_1 = require("file-type");
const is_video_1 = __importDefault(require("is-video"));
const is_image_1 = __importDefault(require("is-image"));
const ffmpeg_1 = __importDefault(require("ffmpeg"));
const multer_1 = require("../../config/multer");
const { sync } = mkdirp_1.default;
let UploadMiddleware = class UploadMiddleware extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    const { filename, size, path } = req.file;
                    const { ext, mime } = yield (0, file_type_1.fromFile)(path);
                    let type;
                    let thumbnail = filename;
                    const fileTypes = /pdf/;
                    const _isPdf = fileTypes.test((0, path_1.extname)(req.file.originalname).toLowerCase());
                    if (_isPdf) {
                        const file = {
                            ext,
                            mime,
                            type,
                            thumbnail: thumbnail,
                            filename,
                            size,
                            dimensions: { height: 0, width: 0, orientation: 1 },
                        };
                        req.body.file = file;
                    }
                    else if ((0, is_video_1.default)(path)) {
                        type = 'video';
                        const file_name = filename.substring(0, filename.indexOf('.'));
                        const video = yield new ffmpeg_1.default(path);
                        yield video.fnExtractFrameToJPG((0, path_1.resolve)(multer_1.FILE_PATH), {
                            number: 1,
                            file_name,
                        });
                        thumbnail = `${file_name}_1.jpg`;
                    }
                    else if ((0, is_image_1.default)(path))
                        type = 'image';
                    else
                        throw new Error('File type is not supported');
                    if (!_isPdf) {
                        const { height, width, orientation } = (0, image_size_1.default)(`${(0, path_1.resolve)(multer_1.FILE_PATH)}/${thumbnail}`);
                        const file = {
                            ext,
                            mime,
                            type,
                            thumbnail: thumbnail,
                            filename,
                            size,
                            dimensions: { height, width, orientation: orientation || 1 },
                        };
                        req.body.file = file;
                    }
                }
                else if (req.files) {
                    const files = [];
                    for (const f of req.files) {
                        const { filename, size, path } = f;
                        const { ext, mime } = yield (0, file_type_1.fromFile)(path);
                        let type;
                        let thumbnail = filename;
                        if ((0, is_video_1.default)(path)) {
                            type = 'video';
                            const file_name = filename.substring(0, filename.indexOf('.'));
                            const video = yield new ffmpeg_1.default(path);
                            yield video.fnExtractFrameToJPG((0, path_1.resolve)(multer_1.FILE_PATH), {
                                number: 1,
                                file_name,
                            });
                            thumbnail = `${file_name}_1.jpg`;
                        }
                        else if ((0, is_image_1.default)(path))
                            type = 'image';
                        else
                            throw new Error('File type is not supported');
                        const { height, width, orientation } = (0, image_size_1.default)(`${(0, path_1.resolve)(multer_1.FILE_PATH)}/${thumbnail}`);
                        const file = {
                            ext,
                            mime,
                            type,
                            thumbnail: thumbnail,
                            filename,
                            size,
                            dimensions: { height, width, orientation: orientation || 1 },
                        };
                        files.push(file);
                    }
                    req.body.files = files;
                }
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
};
UploadMiddleware = __decorate([
    (0, inversify_1.injectable)()
], UploadMiddleware);
exports.UploadMiddleware = UploadMiddleware;
function upload(options) {
    const { filePath, fileName, count } = options;
    const uploader = multer.default({
        dest: filePath,
        storage: multer.diskStorage({
            destination: (req, file, callback) => {
                sync(filePath);
                callback(null, filePath);
            },
            filename: (req, file, callback) => {
                callback(null, Date.now() + (0, path_1.extname)(file.originalname));
            },
        }),
    });
    if (count)
        return uploader.array(fileName, count);
    return uploader.single(fileName || 'file');
}
exports.upload = upload;
//# sourceMappingURL=upload.js.map