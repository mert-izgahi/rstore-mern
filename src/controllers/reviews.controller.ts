import { Request, Response } from "express";
import { ReviewModel } from "../models/review.model";
import { ApiError } from "../lib/api-error";

export const createReview = async (req: Request, res: Response) => {
  const { product, rating, comment } = req.body;
  const { currentUserId } = res.locals;
  const review = await ReviewModel.createReview({
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
};

export const updateReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const review = await ReviewModel.updateReview({ id, rating, comment });
  if (!review) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    data: review,
    title: "Success",
  });
};

export const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const review = await ReviewModel.deleteReview(id);
  if (!review) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    title: "Success",
  });
};

export const getReviews = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const reviews = await ReviewModel.find().populate("account product").skip(skip).limit(limit);
  const count = await ReviewModel.countDocuments();
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
};
