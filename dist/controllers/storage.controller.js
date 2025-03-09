"use strict";
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
exports.getStorage = exports.deleteStorage = exports.uploadStorage = void 0;
const storage_model_1 = __importDefault(require("../models/storage.model"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const getAudioDuration = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        (0, fluent_ffmpeg_1.default)(filePath).ffprobe((err, data) => {
            if (err) {
                reject(err);
            }
            else {
                const duration = data.streams[0].duration;
                resolve(duration);
            }
        });
    });
});
const uploadStorage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const file = (_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.file;
        if (!file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const tempFilePath = Array.isArray(file)
            ? file[0].tempFilePath
            : file.tempFilePath;
        // Detect file type
        const mimeType = Array.isArray(file) ? file[0].mimetype : file.mimetype;
        const isImage = mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith("image/");
        const isAudio = mimeType === null || mimeType === void 0 ? void 0 : mimeType.startsWith("audio/");
        if (!isImage && !isAudio) {
            res.status(400).json({ message: "Unsupported file type" });
            return;
        }
        const result = yield cloudinary_1.default.uploader.upload(tempFilePath, {
            folder: "multi-vendors-store",
            resource_type: isImage ? "image" : "raw",
        });
        const storage = yield storage_model_1.default.create({
            url: result.secure_url,
            public_id: result.public_id,
            format: isImage ? "image" : "audio",
            size: result.bytes,
            width: result.width,
            height: result.height,
            mimeType: result.mimetype,
            duration: isAudio ? yield getAudioDuration(tempFilePath) : null,
        });
        res.status(200).json({
            message: "Image uploaded",
            data: storage,
            status: 200,
            title: "Success",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.uploadStorage = uploadStorage;
const deleteStorage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const image = yield storage_model_1.default.findById(id);
        if (!image) {
            res.status(404).json({ message: "Image not found" });
            return;
        }
        const { public_id } = image;
        yield cloudinary_1.default.uploader.destroy(public_id);
        yield storage_model_1.default.findByIdAndDelete(id);
        res
            .status(200)
            .json({ message: "Image deleted", status: 200, title: "Success" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.deleteStorage = deleteStorage;
const getStorage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const storage = yield storage_model_1.default
        .findById(id);
    if (!storage) {
        res.status(404).json({ message: "Image not found" });
        return;
    }
    res.status(200).json({
        status: 200,
        data: storage,
        title: "Success",
    });
});
exports.getStorage = getStorage;
