import mongoose, { Document } from "mongoose";
import { Category, ProductStatus } from "../lib/enums";

export interface IProductDocument extends Document {
  name: string;
  price: number;
  description: string;
  sku?: string;
  category: Category;
  status: ProductStatus;
  weight: number;
  featured: boolean;
  quantity: number;
  images: string[];
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  rating: number;
  numReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(Category),
      default: Category.OTHER,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(ProductStatus),
      default: ProductStatus.IN_STOCK,
    },
    weight: {
      type: Number,
      required: true,
    },
    featured: {
      type: Boolean,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    dimensions: {
      length: {
        type: Number,
        required: true,
      },
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
    },
    rating: {
      type: Number,
      required: true,
      default: 3,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "products",
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ name: 1, sku: 1 }, { unique: true });
productSchema.pre("save", function (next) {
  if (!this.sku) {
    this.sku = `${this.name}-${this.category}-${this.status}-${Date.now()}`;
  }
  next();
});

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

export const ProductModel = mongoose.model<IProductDocument>(
  "Product",
  productSchema
);
