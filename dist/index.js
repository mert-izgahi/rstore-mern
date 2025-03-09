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
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const configs_1 = __importDefault(require("./configs"));
const mongoose_1 = require("./lib/mongoose");
// Middlewares
const logger_middleware_1 = require("./middlewares/logger.middleware");
const error_handler_middleware_1 = require("./middlewares/error-handler.middleware");
const not_found_middleware_1 = require("./middlewares/not-found.middleware");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const storage_router_1 = require("./routers/storage.router");
const account_router_1 = require("./routers/account.router");
const product_router_1 = require("./routers/product.router");
const order_router_1 = require("./routers/order.router");
const reviews_router_1 = require("./routers/reviews.router");
const stripe_router_1 = require("./routers/stripe.router");
const logger_1 = require("./lib/logger");
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    debug: configs_1.default.NODE_ENV === "development",
}));
app.use(logger_middleware_1.loggerMiddleware);
app.use(auth_middleware_1.authMiddleware);
app.use("/api", account_router_1.accountRouter);
app.use("/api", storage_router_1.storageRouter);
app.use("/api", product_router_1.productRouter);
app.use("/api", order_router_1.orderRouter);
app.use("/api", reviews_router_1.reviewRouter);
app.use("/api", stripe_router_1.stripeRouter);
// Deployment
if (process.env.NODE_ENV === "production") {
    const staticPath = path_1.default.join(__dirname, "../public");
    app.use(express_1.default.static(staticPath));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(staticPath, "index.html"));
    });
}
app.use(error_handler_middleware_1.errorHandlerMiddleware);
app.use(not_found_middleware_1.notFoundMiddleware);
app.listen(configs_1.default.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.connectDatabase)(configs_1.default.MONGODB_URI);
    logger_1.logger.info(`Server is running on port ${configs_1.default.PORT}`);
}));
