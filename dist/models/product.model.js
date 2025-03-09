"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../lib/enums");
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
    },
    category: {
        type: String,
        required: true,
        enum: Object.values(enums_1.Category),
        default: enums_1.Category.OTHER,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(enums_1.ProductStatus),
        default: enums_1.ProductStatus.IN_STOCK,
    },
    weight: {
        type: Number,
        required: true,
    },
    featured: {
        type: Boolean,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    dimensions: {
        length: {
            type: Number,
            required: true,
        },
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
    },
    rating: {
        type: Number,
        required: true,
        default: 3,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
    collection: "products",
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
productSchema.index({ name: 1, sku: 1 }, { unique: true });
productSchema.pre("save", function (next) {
    if (!this.sku) {
        this.sku = `${this.name}-${this.category}-${this.status}-${Date.now()}`;
    }
    next();
});
productSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "product",
});
exports.ProductModel = mongoose_1.default.model("Product", productSchema);
