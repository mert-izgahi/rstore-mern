import mongoose, { Document } from "mongoose";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../lib/enums";

export interface IOrderDocument extends Document {
  account: mongoose.Types.ObjectId;
  items: {
    productId: string;
    quantity: number;
    title: string;
    price: number;
    image: string;
  }[];
  status: OrderStatus;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippedAt: Date;
  completedAt: Date;
  paidAt: Date;
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrderDocument>(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
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
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
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
      enum: Object.values(PaymentMethod),
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paymentId: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const OrderModel = mongoose.model<IOrderDocument>("Order", orderSchema);
