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
exports.ReviewModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = require("./product.model");
const reviewSchema = new mongoose_1.default.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    account: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
const updateProductRating = (product, reviews) => __awaiter(void 0, void 0, void 0, function* () {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    yield product_model_1.ProductModel.findByIdAndUpdate(product, { rating: averageRating });
});
reviewSchema.statics.createReview = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ rating, comment, product, account, }) {
        const review = yield this.create({ rating, comment, product, account });
        const productRef = yield product_model_1.ProductModel.findById(review.product);
        const reviews = yield this.find({ product: productRef === null || productRef === void 0 ? void 0 : productRef._id });
        yield updateProductRating(productRef === null || productRef === void 0 ? void 0 : productRef._id, reviews);
        return review;
    });
};
reviewSchema.statics.updateReview = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, rating, comment, }) {
        const review = yield this.findByIdAndUpdate(id, { rating, comment }, { new: true });
        const reviews = yield this.find({ product: review === null || review === void 0 ? void 0 : review.product });
        yield updateProductRating(review === null || review === void 0 ? void 0 : review.product.toString(), reviews);
        return review;
    });
};
reviewSchema.statics.deleteReview = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const review = yield this.findByIdAndDelete(id);
        const reviews = yield this.find({ product: review === null || review === void 0 ? void 0 : review.product });
        yield updateProductRating(review === null || review === void 0 ? void 0 : review.product.toString(), reviews);
        return id;
    });
};
reviewSchema.pre("find", function (next) {
    this.populate("product");
    this.populate("account");
    next();
});
reviewSchema.pre("findOne", function (next) {
    this.populate("product");
    this.populate("account");
    next();
});
exports.ReviewModel = mongoose_1.default.model("Review", reviewSchema);
