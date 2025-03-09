import express from "express";
import cookieParser from "cookie-parser";
import expressFileUpload from "express-fileupload";
import cors, { CorsOptions } from "cors";

import configs from "./configs";
import { connectDatabase } from "./lib/mongoose";
// Middlewares
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { authMiddleware } from "./middlewares/auth.middleware";

import { storageRouter } from "./routers/storage.router";
import { accountRouter } from "./routers/account.router";
import { productRouter } from "./routers/product.router";
import { orderRouter } from "./routers/order.router";
import { reviewRouter } from "./routers/reviews.router";
import { stripeRouter } from "./routers/stripe.router";

import { logger } from "./lib/logger";

const app = express();

const corsOptions = {
  origin: (origin: string, callback: any) => {
    if (configs.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
} as CorsOptions;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    debug: configs.NODE_ENV === "development",
  })
);

app.use(loggerMiddleware);
app.use(authMiddleware);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", accountRouter);
app.use("/api", storageRouter);
app.use("/api", productRouter);
app.use("/api", orderRouter);
app.use("/api", reviewRouter);
app.use("/api", stripeRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

app.listen(configs.PORT, async () => {
  await connectDatabase(configs.MONGODB_URI!);
  logger.info(`Server is running on port ${configs.PORT}`);
});
