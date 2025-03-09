import { faker } from "@faker-js/faker";
import { IProductDocument, ProductModel } from "../models/product.model";
import { IAccountDocument, AccountModel } from "../models/account.model";
import { IOrderDocument, OrderModel } from "../models/order.model";
import { IReviewDocument, ReviewModel } from "../models/review.model";
import {
  Category,
  ProductStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "./enums";
import { connectDatabase } from "./mongoose";
import configs from "../configs";

export const createFakeProduct = (): Partial<IProductDocument> => {
  return {
    name: faker.commerce.productName(),
    price: Math.round(faker.number.float({ min: 10, max: 1000 })),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(Object.values(Category)),
    status: faker.helpers.arrayElement(Object.values(ProductStatus)),
    featured: faker.datatype.boolean(),
    weight: Math.round(faker.number.float({ min: 10, max: 100 })),
    quantity: faker.number.int({ min: 10, max: 100 }),
    images: new Array(3).fill(faker.image.url()),
    rating: Math.round(faker.number.float({ min: 1, max: 5 })),
    numReviews: faker.number.int({ min: 10, max: 100 }),
    dimensions: {
      length: Math.round(faker.number.float({ min: 10, max: 100 })),
      width: Math.round(faker.number.float({ min: 10, max: 100 })),
      height: Math.round(faker.number.float({ min: 10, max: 100 })),
    },
  };
};

export const createFakeProducts = (
  count: number
): Partial<IProductDocument>[] => {
  return Array.from({ length: count }, () => createFakeProduct());
};

export const createFakeAccount = (): Partial<IAccountDocument> => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: "Password123",
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    imageUrl: faker.image.avatar(),
    role: "user",
    isBlocked: faker.datatype.boolean(),
    isDeleted: faker.datatype.boolean(),
    isVerified: faker.datatype.boolean(),
    address: new Array(Math.floor(Math.random() * 5)).fill({
      isDefault: faker.datatype.boolean(),
      street: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zipCode: faker.location.zipCode(),
    }),
  };
};

export const createFakeAccounts = (
  count: number
): Partial<IAccountDocument>[] => {
  return Array.from({ length: count }, () => createFakeAccount());
};

export const createFakeOrder = async (): Promise<Partial<IOrderDocument>> => {
  connectDatabase(configs.MONGODB_URI!);
  const accounts = await AccountModel.find({ role: { $ne: "admin" } });
  const products = await ProductModel.find({});

  const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
  const randomProducts = products.slice(
    1,
    Math.floor(Math.random() * products.length)
  );
  if (!randomAccount) {
    throw new Error("No accounts found");
  }
  if (!randomProducts) {
    throw new Error("No products found");
  }
  const order = {
    account: (randomAccount._id as any).toString(),
    items: randomProducts.map((product) => {
      return {
        productId: (product._id as any).toString(),
        quantity: Math.floor(Math.random() * 10),
        price: product.price,
        title: product.name,
        image: product.images[0],
      };
    }),
    status: faker.helpers.arrayElement(Object.values(OrderStatus)),
    shippingAddress: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      address: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zipCode: faker.location.zipCode(),
    },
    paymentMethod: faker.helpers.arrayElement(Object.values(PaymentMethod)),
    paymentStatus: faker.helpers.arrayElement(Object.values(PaymentStatus)),
    total: Math.round(faker.number.float({ min: 10, max: 1000 })),
    paidAt: faker.date.future(),
    processedAt: faker.date.future(),
    completedAt: faker.date.future(),
  };
  return order;
};

export const createFakeReview = async (): Promise<Partial<IReviewDocument>> => {
  await connectDatabase(configs.MONGODB_URI!);
  const accounts = await AccountModel.find({ role: { $ne: "admin" } });
  const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
  if (!randomAccount) {
    throw new Error("No accounts found");
  }

  const products = await ProductModel.find({});
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  if (!randomProduct) {
    throw new Error("No products found");
  }
  return {
    rating: Math.round(faker.number.float({ min: 1, max: 5 })),
    comment: faker.lorem.sentence(),
    product: (randomProduct._id as any).toString(),
    account: (randomAccount._id as any).toString(),
  };
};

export const createFakeReviews = async (count: number) => {
  let reviews: any[] = [];
  for (let i = 0; i < count; i++) {
    const review = await createFakeReview();
    reviews.push(review);
  }
  return reviews;
};

export const createFakeOrders = async (count: number) => {
  let orders: any[] = [];
  for (let i = 0; i < count; i++) {
    const order = await createFakeOrder();
    orders.push(order);
  }
  return orders;
};

const seedProducts = async () => {
  try {
    await connectDatabase(configs.MONGODB_URI!);
    await ProductModel.deleteMany({});
    const products = createFakeProducts(10);
    await ProductModel.insertMany(products);
    console.log("Database seeded successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const seedAccounts = async () => {
  try {
    await connectDatabase(configs.MONGODB_URI!);
    await AccountModel.deleteMany({ role: { $ne: "admin" } });
    const accounts = createFakeAccounts(10);
    await AccountModel.insertMany(accounts);
    console.log("Database seeded successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const seedOrders = async () => {
  try {
    await connectDatabase(configs.MONGODB_URI!);
    await OrderModel.deleteMany({});
    const orders = await createFakeOrders(10);

    await OrderModel.insertMany(orders);
    console.log("Database seeded successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const seedReviews = async () => {
  try {
    await connectDatabase(configs.MONGODB_URI!);
    await ReviewModel.deleteMany({});
    const reviews = await createFakeReviews(10);
    for (const review of reviews) {
      await ReviewModel.createReview(
        {
          rating: review.rating,
          comment: review.comment,
          product: review.product,
          account: review.account,
        }
      );
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
const seedDb = async () => {
  await seedProducts();
  await seedAccounts();
  await seedOrders();
  await seedReviews();
};

seedDb();
