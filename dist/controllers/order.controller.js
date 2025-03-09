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
exports.deleteOrder = exports.updateOrderStatus = exports.updateOrder = exports.createOrder = exports.getOrder = exports.getOrders = exports.fuzeSearchOrders = void 0;
const order_model_1 = require("../models/order.model");
const api_error_1 = require("../lib/api-error");
const fuse_js_1 = __importDefault(require("fuse.js"));
const fuzeSearchOrders = (orders, search, page, limit) => {
    const fuse = new fuse_js_1.default(orders, {
        keys: ["account.firstName", "account.lastName", "account.email"],
        threshold: 0.3,
        includeScore: true,
    });
    const filteredResults = fuse.search(search);
    const finalResults = filteredResults.map((result) => result.item);
    const paginatedResults = finalResults.slice((page - 1) * limit, page * limit);
    const count = finalResults.length;
    const pages = Math.ceil(count / limit);
    const hasNextPage = page < pages;
    const hasPrevPage = page > 1;
    return {
        records: paginatedResults,
        pagination: {
            page,
            limit,
            pages,
            hasNextPage,
            hasPrevPage,
        },
    };
};
exports.fuzeSearchOrders = fuzeSearchOrders;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const queryObj = {};
    const { search, status, paymentStatus } = req.query;
    if (status) {
        queryObj.status = status;
    }
    if (paymentStatus) {
        queryObj.paymentStatus = paymentStatus;
    }
    const orders = yield order_model_1.OrderModel.find(queryObj)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("account");
    if (search) {
        const data = (0, exports.fuzeSearchOrders)(orders, search, page, limit);
        res.status(200).json({
            status: 200,
            data,
            title: "Success",
        });
        return;
    }
    const count = yield order_model_1.OrderModel.countDocuments(queryObj);
    const pages = Math.ceil(count / limit);
    const hasNextPage = page < pages;
    const hasPrevPage = page > 1;
    res.status(200).json({
        status: 200,
        data: {
            records: orders,
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
exports.getOrders = getOrders;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield order_model_1.OrderModel.findById(id).populate("account");
    if (!order)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        data: order,
        title: "Success",
    });
});
exports.getOrder = getOrder;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentUserId } = res.locals;
    const order = yield order_model_1.OrderModel.create(Object.assign(Object.assign({}, req.body), { account: currentUserId }));
    res.status(201).json({
        status: 201,
        message: "Order created successfully",
        title: "Success",
        data: order,
    });
});
exports.createOrder = createOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield order_model_1.OrderModel.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    if (!order)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        data: order,
        title: "Success",
    });
});
exports.updateOrder = updateOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield order_model_1.OrderModel.findById(id);
    if (!order)
        throw api_error_1.ApiError.notFound();
    order.status = req.body.status;
    yield order.save();
    res.status(200).json({
        status: 200,
        data: order,
        title: "Success",
    });
});
exports.updateOrderStatus = updateOrderStatus;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield order_model_1.OrderModel.findByIdAndDelete(id);
    if (!order)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        title: "Success",
    });
});
exports.deleteOrder = deleteOrder;
