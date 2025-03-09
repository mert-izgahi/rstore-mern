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
exports.stripeSuccessCallback = exports.createStripeSession = void 0;
const stripe_1 = require("../lib/stripe");
const configs_1 = __importDefault(require("../configs"));
const api_error_1 = require("../lib/api-error");
const order_model_1 = require("../models/order.model");
const enums_1 = require("../lib/enums");
const account_model_1 = require("../models/account.model");
const product_model_1 = require("../models/product.model");
const createStripeSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield order_model_1.OrderModel.findById(id).populate("account");
    if (!order)
        throw api_error_1.ApiError.notFound();
    const lineItems = order.items.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.title,
                    images: [item.image],
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        };
    });
    const session = yield stripe_1.stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        customer_email: order.account.email,
        success_url: `${configs_1.default.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${configs_1.default.CLIENT_URL}/checkout/cancel`,
        metadata: {
            orderId: id,
        },
    });
    res.status(200).json({
        status: 200,
        data: session.id,
        title: "Success",
    });
});
exports.createStripeSession = createStripeSession;
const stripeSuccessCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.query;
    const session = yield stripe_1.stripeClient.checkout.sessions.retrieve(sessionId);
    if (!session)
        throw api_error_1.ApiError.notFound();
    const orderId = (session === null || session === void 0 ? void 0 : session.metadata).orderId;
    const order = yield order_model_1.OrderModel.findById(orderId);
    if (!order)
        throw api_error_1.ApiError.notFound();
    const isPaid = session.payment_status === "paid";
    if (!isPaid)
        throw api_error_1.ApiError.badRequest("Payment failed");
    // update order
    if (isPaid) {
        order.paymentStatus = enums_1.PaymentStatus.PAID;
        order.paidAt = new Date();
        order.paymentId = session.payment_intent;
        yield order.save();
    }
    // update account
    const account = yield account_model_1.AccountModel.findById(order.account);
    if (!account)
        throw api_error_1.ApiError.notFound();
    account.ordersCount += 1;
    account.totalSpent += order.total;
    account.lastOrderAt = new Date();
    yield account.save();
    // update stock
    order.items.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield product_model_1.ProductModel.findById(item.productId);
        if (!product)
            throw api_error_1.ApiError.notFound();
        product.quantity -= item.quantity;
        if (product.quantity === 0) {
            product.status = enums_1.ProductStatus.OUT_OF_STOCK;
        }
        if (product.quantity < 10) {
            product.status = enums_1.ProductStatus.LOW_STOCK;
        }
        yield product.save();
    }));
    res.status(200).json({
        status: 200,
        data: true,
        title: "Success",
    });
});
exports.stripeSuccessCallback = stripeSuccessCallback;
