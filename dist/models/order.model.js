"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../lib/enums");
const orderSchema = new mongoose_1.default.Schema({
    account: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    items: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true },
            title: { type: String, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true },
        },
    ],
    status: {
        type: String,
        enum: Object.values(enums_1.OrderStatus),
        default: enums_1.OrderStatus.PENDING,
    },
    shippedAt: {
        type: Date,
    },
    paidAt: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
    },
    total: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: Object.values(enums_1.PaymentMethod),
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: Object.values(enums_1.PaymentStatus),
        default: enums_1.PaymentStatus.PENDING,
    },
    paymentId: { type: String },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.OrderModel = mongoose_1.default.model("Order", orderSchema);
