"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeClient = void 0;
const stripe_1 = __importDefault(require("stripe"));
const configs_1 = __importDefault(require("../configs"));
exports.stripeClient = new stripe_1.default(configs_1.default.STRIPE_SECRET_KEY);
