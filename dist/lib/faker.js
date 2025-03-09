"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeOrders = exports.createFakeReviews = exports.createFakeReview = exports.createFakeOrder = exports.createFakeAccounts = exports.createFakeAccount = exports.createFakeProducts = exports.createFakeProduct = void 0;
const faker_1 = require("@faker-js/faker");
const product_model_1 = require("../models/product.model");
const account_model_1 = require("../models/account.model");
const order_model_1 = require("../models/order.model");
const review_model_1 = require("../models/review.model");
const enums_1 = require("./enums");
const mongoose_1 = require("./mongoose");
const configs_1 = __importDefault(require("../configs"));
const createFakeProduct = () => {
    return {
        name: faker_1.faker.commerce.productName(),
        price: Math.round(faker_1.faker.number.float({ min: 10, max: 1000 })),
        description: faker_1.faker.commerce.productDescription(),
        category: faker_1.faker.helpers.arrayElement(Object.values(enums_1.Category)),
        status: faker_1.faker.helpers.arrayElement(Object.values(enums_1.ProductStatus)),
        featured: faker_1.faker.datatype.boolean(),
        weight: Math.round(faker_1.faker.number.float({ min: 10, max: 100 })),
        quantity: faker_1.faker.number.int({ min: 10, max: 100 }),
        images: new Array(3).fill(faker_1.faker.image.url()),
        rating: Math.round(faker_1.faker.number.float({ min: 1, max: 5 })),
        numReviews: faker_1.faker.number.int({ min: 10, max: 100 }),
        dimensions: {
            length: Math.round(faker_1.faker.number.float({ min: 10, max: 100 })),
            width: Math.round(faker_1.faker.number.float({ min: 10, max: 100 })),
            height: Math.round(faker_1.faker.number.float({ min: 10, max: 100 })),
        },
    };
};
exports.createFakeProduct = createFakeProduct;
const createFakeProducts = (count) => {
    return Array.from({ length: count }, () => (0, exports.createFakeProduct)());
};
exports.createFakeProducts = createFakeProducts;
const createFakeAccount = () => {
    return {
        firstName: faker_1.faker.person.firstName(),
        lastName: faker_1.faker.person.lastName(),
        password: "Password123",
        email: faker_1.faker.internet.email(),
        phoneNumber: faker_1.faker.phone.number(),
        imageUrl: faker_1.faker.image.avatar(),
        role: "user",
        isBlocked: faker_1.faker.datatype.boolean(),
        isDeleted: faker_1.faker.datatype.boolean(),
        isVerified: faker_1.faker.datatype.boolean(),
    };
};
exports.createFakeAccount = createFakeAccount;
const createFakeAccounts = (count) => {
    return Array.from({ length: count }, () => (0, exports.createFakeAccount)());
};
exports.createFakeAccounts = createFakeAccounts;
const createFakeOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongoose_1.connectDatabase)(configs_1.default.MONGODB_URI);
    const accounts = yield account_model_1.AccountModel.find({ role: { $ne: "admin" } });
    const products = yield product_model_1.ProductModel.find({});
    const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
    const randomProducts = products.slice(1, Math.floor(Math.random() * products.length));
    if (!randomAccount) {
        throw new Error("No accounts found");
    }
    if (!randomProducts) {
        throw new Error("No products found");
    }
    const order = {
        account: randomAccount._id.toString(),
        items: randomProducts.map((product) => {
            return {
                productId: product._id.toString(),
                quantity: Math.floor(Math.random() * 10),
                price: product.price,
                title: product.name,
                image: product.images[0],
            };
        }),
        status: faker_1.faker.helpers.arrayElement(Object.values(enums_1.OrderStatus)),
        shippingAddress: {
            firstName: faker_1.faker.person.firstName(),
            lastName: faker_1.faker.person.lastName(),
            address: faker_1.faker.location.street(),
            city: faker_1.faker.location.city(),
            state: faker_1.faker.location.state(),
            country: faker_1.faker.location.country(),
            zipCode: faker_1.faker.location.zipCode(),
        },
        paymentMethod: faker_1.faker.helpers.arrayElement(Object.values(enums_1.PaymentMethod)),
        paymentStatus: faker_1.faker.helpers.arrayElement(Object.values(enums_1.PaymentStatus)),
        total: Math.round(faker_1.faker.number.float({ min: 10, max: 1000 })),
        paidAt: faker_1.faker.date.future(),
        processedAt: faker_1.faker.date.future(),
        completedAt: faker_1.faker.date.future(),
    };
    return order;
});
exports.createFakeOrder = createFakeOrder;
const createFakeReview = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.connectDatabase)(configs_1.default.MONGODB_URI);
    const accounts = yield account_model_1.AccountModel.find({ role: { $ne: "admin" } });
    const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
    if (!randomAccount) {
        throw new Error("No accounts found");
    }
    const products = yield product_model_1.ProductModel.find({});
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    if (!randomProduct) {
        throw new Error("No products found");
    }
    return {
        rating: Math.round(faker_1.faker.number.float({ min: 1, max: 5 })),
        comment: faker_1.faker.lorem.sentence(),
        product: randomProduct._id.toString(),
        account: randomAccount._id.toString(),
    };
});
exports.createFakeReview = createFakeReview;
const createFakeReviews = (count) => __awaiter(void 0, void 0, void 0, function* () {
    let reviews = [];
    for (let i = 0; i < count; i++) {
        const review = yield (0, exports.createFakeReview)();
        reviews.push(review);
    }
    return reviews;
});
exports.createFakeReviews = createFakeReviews;
const createFakeOrders = (count) => __awaiter(void 0, void 0, void 0, function* () {
    let orders = [];
    for (let i = 0; i < count; i++) {
        const order = yield (0, exports.createFakeOrder)();
        orders.push(order);
    }
    return orders;
});
exports.createFakeOrders = createFakeOrders;
const seedProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connectDatabase)(configs_1.default.MONGODB_URI);
        yield product_model_1.ProductModel.deleteMany({});
        const products = (0, exports.createFakeProducts)(10);
        yield product_model_1.ProductModel.insertMany(products);
        console.log("Database seeded successfully");
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
const seedAccounts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connectDatabase)(configs_1.default.MONGODB_URI);
        yield account_model_1.AccountModel.deleteMany({ role: { $ne: "admin" } });
        const accounts = (0, exports.createFakeAccounts)(10);
        yield account_model_1.AccountModel.insertMany(accounts);
        console.log("Database seeded successfully");
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
const seedOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connectDatabase)(configs_1.default.MONGODB_URI);
        yield order_model_1.OrderModel.deleteMany({});
        const orders = yield (0, exports.createFakeOrders)(10);
        yield order_model_1.OrderModel.insertMany(orders);
        console.log("Database seeded successfully");
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
const seedReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connectDatabase)(configs_1.default.MONGODB_URI);
        yield review_model_1.ReviewModel.deleteMany({});
        const reviews = yield (0, exports.createFakeReviews)(10);
        for (const review of reviews) {
            yield review_model_1.ReviewModel.createReview({
                rating: review.rating,
                comment: review.comment,
                product: review.product,
                account: review.account,
            });
        }
        console.log("Database seeded successfully");
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
const seedDb = () => __awaiter(void 0, void 0, void 0, function* () {
    yield seedProducts();
    yield seedAccounts();
    yield seedOrders();
    yield seedReviews();
});
seedDb();
