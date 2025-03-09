import mongoose, { Document } from "mongoose";
import { ProductModel } from "./product.model";
export interface IReviewDocument extends Document {
  product: mongoose.Types.ObjectId;
  account: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewModel extends mongoose.Model<IReviewDocument> {
  createReview({
    rating,
    comment,
    product,
    account,
  }: {
    rating: number;
    comment: string;
    product: string;
    account: string;
  }): Promise<IReviewDocument>;
  updateReview({
    id,
    rating,
    comment,
  }: {
    id: string;
    rating: number;
    comment: string;
  }): Promise<IReviewDocument>;
  deleteReview(id: string): Promise<IReviewDocument>;
}

const reviewSchema = new mongoose.Schema<IReviewDocument, IReviewModel>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const updateProductRating = async (
  product: string,
  reviews: IReviewDocument[]
) => {
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  await ProductModel.findByIdAndUpdate(product, { rating: averageRating });
};

reviewSchema.statics.createReview = async function ({
  rating,
  comment,
  product,
  account,
}: {
  rating: number;
  comment: string;
  product: string;
  account: string;
}) {
  const review = await this.create({ rating, comment, product, account });
  const productRef = await ProductModel.findById(review.product);
  const reviews = await this.find({ product: productRef?._id });

  await updateProductRating(productRef?._id as string, reviews);
  return review;
};

reviewSchema.statics.updateReview = async function ({
  id,
  rating,
  comment,
}: {
  id: string;
  rating: number;
  comment: string;
}) {
  const review = await this.findByIdAndUpdate(
    id,
    { rating, comment },
    { new: true }
  );
  const reviews = await this.find({ product: review?.product });
  await updateProductRating(review?.product.toString() as string, reviews);
  return review;
};

reviewSchema.statics.deleteReview = async function (id: string) {
  const review = await this.findByIdAndDelete(id);
  const reviews = await this.find({ product: review?.product });
  await updateProductRating(review?.product.toString() as string, reviews);
  return id;
};

reviewSchema.pre("find", function (next) {
  this.populate("product");
  this.populate("account");
  next();
})

reviewSchema.pre("findOne", function (next) {
  this.populate("product");
  this.populate("account");
  next();
})

export const ReviewModel = mongoose.model<IReviewDocument, IReviewModel>(
  "Review",
  reviewSchema
);
