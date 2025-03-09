"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const storageSchema = new mongoose_1.default.Schema({
    url: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
    format: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
    },
    width: {
        type: Number,
    },
    height: {
        type: Number,
    },
    duration: {
        type: Number,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
const StorageModel = mongoose_1.default.model("Storage", storageSchema);
exports.default = StorageModel;
