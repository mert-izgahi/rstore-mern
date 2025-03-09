import { Request, Response } from "express";
import { ProductModel } from "../models/product.model";
import { ApiError } from "../lib/api-error";

export const createProduct = async (req: Request, res: Response) => {
  const product = await ProductModel.create(req.body);
  res.status(201).json({
    status: 201,
    message: "Product created successfully",
    title: "Success",
    data: product,
  });
};

export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const queryObj = {} as any;

  const { search, category, status, sortBy, sortOrder, minPrice, maxPrice } =
    req.query;

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
    queryObj.price = { ...queryObj.price, $lte: maxPrice };
  }

  const products = await ProductModel.find(queryObj)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy as string]: sortOrder === "asc" ? 1 : -1 });

  const count = await ProductModel.countDocuments(queryObj);
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
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id).populate("reviews");
  if (!product) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    data: product,
    title: "Success",
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!product) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    data: product,
    title: "Success",
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    title: "Success",
  });
};

export const getTopRatedProducts = async (req: Request, res: Response) => {
  const products = await ProductModel.find().sort({ rating: -1 }).limit(12);
  res.status(200).json({
    status: 200,
    data: products,
    title: "Success",
  });
};
