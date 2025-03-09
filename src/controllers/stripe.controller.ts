import { Request, Response } from "express";
import { stripeClient } from "../lib/stripe";
import configs from "../configs";
import { ApiError } from "../lib/api-error";
import { OrderModel } from "../models/order.model";
import { PaymentStatus, ProductStatus } from "../lib/enums";
import { AccountModel } from "../models/account.model";
import { ProductModel } from "../models/product.model";

export const createStripeSession = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await OrderModel.findById(id).populate("account");
  if (!order) throw ApiError.notFound();

  const lineItems = order.items.map((item: any) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity as number,
    };
  });
  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: (order.account as any).email,
    success_url: `${configs.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${configs.CLIENT_URL}/checkout/cancel`,
    metadata: {
      orderId: id,
    },
  });

  res.status(200).json({
    status: 200,
    data: session.id,
    title: "Success",
  });
};

export const stripeSuccessCallback = async (req: Request, res: Response) => {
  const { sessionId } = req.query;
  const session = await stripeClient.checkout.sessions.retrieve(
    sessionId as string
  );
  
  
  if (!session) throw ApiError.notFound();
  const orderId = (session?.metadata as any).orderId;

  const order = await OrderModel.findById(orderId);
  if (!order) throw ApiError.notFound();

  const isPaid = session.payment_status === "paid";
  if (!isPaid) throw ApiError.badRequest("Payment failed");
  // update order
  if (isPaid) {
    order.paymentStatus = PaymentStatus.PAID;
    order.paidAt = new Date();
    order.paymentId = session.payment_intent as string;
    await order.save();
  }
  // update account
  const account = await AccountModel.findById(order.account);
  if (!account) throw ApiError.notFound();
  account.ordersCount += 1;
  account.totalSpent += order.total;
  account.lastOrderAt = new Date();
  await account.save();

  // update stock
  order.items.forEach(async (item: any) => {
    const product = await ProductModel.findById(item.productId);
    if (!product) throw ApiError.notFound();
    product.quantity -= item.quantity;

    if (product.quantity === 0) {
      product.status = ProductStatus.OUT_OF_STOCK;
    }
    if (product.quantity < 10) {
      product.status = ProductStatus.LOW_STOCK;
    }

    await product.save();
  });

  res.status(200).json({
    status: 200,
    data: true,
    title: "Success",
  });
};
