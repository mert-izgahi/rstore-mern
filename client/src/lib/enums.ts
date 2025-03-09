export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export enum Category {
  ELECTRONICS = "electronics",
  CLOTHING = "clothing",
  BOOKS = "books",
  FURNITURE = "furniture",
  TOYS = "toys",
  GROCERIES = "groceries",
  OTHER = "other",
}

export enum ProductStatus {
  IN_STOCK = "in_stock",
  OUT_OF_STOCK = "out_of_stock",
  LOW_STOCK = "low_stock",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export enum OrderStatus {
  PENDING = "pending",
  SHIPPED = "shipped",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = "cash_on_delivery",
  CART = "cart",
}
