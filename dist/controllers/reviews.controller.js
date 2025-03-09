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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviews = exports.deleteReview = exports.updateReview = exports.createReview = void 0;
const review_model_1 = require("../models/review.model");
const api_error_1 = require("../lib/api-error");
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product, rating, comment } = req.body;
    const { currentUserId } = res.locals;
    const review = yield review_model_1.ReviewModel.createReview({
        product,
        account: currentUserId,
        rating,
        comment,
    });
    res.status(201).json({
        status: 201,
        message: "Review created successfully",
        title: "Success",
        data: review,
    });
});
exports.createReview = createReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const review = yield review_model_1.ReviewModel.updateReview({ id, rating, comment });
    if (!review)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        data: review,
        title: "Success",
    });
});
exports.updateReview = updateReview;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const review = yield review_model_1.ReviewModel.deleteReview(id);
    if (!review)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        title: "Success",
    });
});
exports.deleteReview = deleteReview;
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const reviews = yield review_model_1.ReviewModel.find().populate("account product").skip(skip).limit(limit);
    const count = yield review_model_1.ReviewModel.countDocuments();
    const pages = Math.ceil(count / limit);
    const hasNextPage = page < pages;
    const hasPrevPage = page > 1;
    res.status(200).json({
        status: 200,
        data: {
            records: reviews,
            pagination: {
                page,
                limit,
                pages,
                hasNextPage,
                hasPrevPage,
            },
        },
        title: "Success",
    });
});
exports.getReviews = getReviews;
