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
exports.getTopRatedProducts = exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProducts = exports.createProduct = void 0;
const product_model_1 = require("../models/product.model");
const api_error_1 = require("../lib/api-error");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.ProductModel.create(req.body);
    res.status(201).json({
        status: 201,
        message: "Product created successfully",
        title: "Success",
        data: product,
    });
});
exports.createProduct = createProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const queryObj = {};
    const { search, category, status, sortBy, sortOrder, minPrice, maxPrice } = req.query;
    if (search) {
        queryObj["$or"] = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }
    if (category) {
        queryObj.category = category;
    }
    if (status) {
        queryObj.status = status;
    }
    if (minPrice) {
        queryObj.price = { $gte: minPrice };
    }
    if (maxPrice) {
        queryObj.price = Object.assign(Object.assign({}, queryObj.price), { $lte: maxPrice });
    }
    const products = yield product_model_1.ProductModel.find(queryObj)
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 });
    const count = yield product_model_1.ProductModel.countDocuments(queryObj);
    const pages = Math.ceil(count / limit);
    const hasNextPage = page < pages;
    const hasPrevPage = page > 1;
    res.status(200).json({
        status: 200,
        data: {
            records: products,
            pagination: {
                page,
                limit,
                pages,
                count,
                hasNextPage,
                hasPrevPage,
            },
        },
        title: "Success",
    });
});
exports.getProducts = getProducts;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_model_1.ProductModel.findById(id).populate("reviews");
    if (!product)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        data: product,
        title: "Success",
    });
});
exports.getProduct = getProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_model_1.ProductModel.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    if (!product)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        data: product,
        title: "Success",
    });
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_model_1.ProductModel.findByIdAndDelete(id);
    if (!product)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        title: "Success",
    });
});
exports.deleteProduct = deleteProduct;
const getTopRatedProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.ProductModel.find().sort({ rating: -1 }).limit(12);
    res.status(200).json({
        status: 200,
        data: products,
        title: "Success",
    });
});
exports.getTopRatedProducts = getTopRatedProducts;
