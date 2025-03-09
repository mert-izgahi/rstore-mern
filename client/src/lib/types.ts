import {
  Category,
  OrderStatus,
  ProductStatus,
  PaymentStatus,
  PaymentMethod,
} from "./enums";

export interface IAccount {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  imageUrl: string;
  hasImage: boolean;
  phoneNumber: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiresAt: Date;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: Date;
  passwordResetToken?: string;
  passwordResetTokenExpiresAt: Date;

  isDeleted: boolean;
  isBlocked: boolean;
  lastSignInAt: Date;
  orders: IOrder[];
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorage {
  _id: string;
  url: string;
  public_id: string;
  format: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  _id: string;
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
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IDataWithPagination<T> {
  records: T[];
  pagination: {
    page: number;
    limit: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface IOrder {
  _id: string;
  account: IAccount;
  items: IOrderItem[];
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
  paymentId: string;
  processedAt: Date;
  paidAt: Date;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  productId: string;
  quantity: number;
  title: string;
  price: number;
  image: string;
}
export interface IReview {
  _id: string;
  product: IProduct;
  account: IAccount;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
