"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.OrderStatus = exports.PaymentStatus = exports.ProductStatus = exports.Category = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["USER"] = "user";
})(Role || (exports.Role = Role = {}));
var Category;
(function (Category) {
    Category["ELECTRONICS"] = "electronics";
    Category["CLOTHING"] = "clothing";
    Category["BOOKS"] = "books";
    Category["FURNITURE"] = "furniture";
    Category["TOYS"] = "toys";
    Category["GROCERIES"] = "groceries";
    Category["OTHER"] = "other";
})(Category || (exports.Category = Category = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["IN_STOCK"] = "in_stock";
    ProductStatus["OUT_OF_STOCK"] = "out_of_stock";
    ProductStatus["LOW_STOCK"] = "low_stock";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH_ON_DELIVERY"] = "cash_on_delivery";
    PaymentMethod["CART"] = "cart";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
