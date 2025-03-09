import { Request, Response } from "express";
import { IOrderDocument, OrderModel } from "../models/order.model";
import { ApiError } from "../lib/api-error";
import Fuze from "fuse.js";


export const fuzeSearchOrders = (
  orders: IOrderDocument[],
  search: string,
  page: number,
  limit: number
) => {
  const fuse = new Fuze(orders, {
    keys: ["account.firstName", "account.lastName", "account.email"],
    threshold: 0.3,
    includeScore: true,
  });
  const filteredResults = fuse.search(search as string);
  const finalResults = filteredResults.map((result: any) => result.item);
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

export const getOrders = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const queryObj = {} as any;

  const { search, status, paymentStatus } = req.query;

  if (status) {
    queryObj.status = status;
  }

  if (paymentStatus) {
    queryObj.paymentStatus = paymentStatus;
  }

  const orders = await OrderModel.find(queryObj)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("account");

  if (search) {
    const data = fuzeSearchOrders(orders, search as string, page, limit);
    res.status(200).json({
      status: 200,
      data,
      title: "Success",
    });
    return;
  }

  const count = await OrderModel.countDocuments(queryObj);
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
};

export const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await OrderModel.findById(id).populate("account");
  if (!order) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    data: order,
    title: "Success",
  });
};



export const createOrder = async (req: Request, res: Response) => {
  const { currentUserId } = res.locals;

  const order = await OrderModel.create({
    ...req.body,
    account: currentUserId,
  });
  res.status(201).json({
    status: 201,
    message: "Order created successfully",
    title: "Success",
    data: order,
  });
};

export const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await OrderModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!order) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    data: order,
    title: "Success",
  });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await OrderModel.findById(id);
  if (!order) throw ApiError.notFound();
  order.status = req.body.status;
  await order.save();
  res.status(200).json({
    status: 200,
    data: order,
    title: "Success",
  });
};

export const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await OrderModel.findByIdAndDelete(id);
  if (!order) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    title: "Success",
  });
};
