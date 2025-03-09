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
exports.AccountModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../lib/enums");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = __importDefault(require("../configs"));
const crypto_1 = __importDefault(require("crypto"));
const dayjs_1 = __importDefault(require("dayjs"));
const accountSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        default: enums_1.Role.USER,
        required: true,
        enum: Object.values(enums_1.Role),
    },
    imageUrl: {
        type: String,
    },
    hasImage: {
        type: Boolean,
        default: false,
    },
    lastOrderAt: {
        type: Date,
    },
    ordersCount: {
        type: Number,
        default: 0,
    },
    totalSpent: {
        type: Number,
        default: 0,
    },
    phoneNumber: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    verificationTokenExpiresAt: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetTokenExpiresAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    lastSignInAt: {
        type: Date,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
accountSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            const salt = yield bcryptjs_1.default.genSalt(10);
            this.password = yield bcryptjs_1.default.hash(this.password, salt);
        }
        next();
    });
});
accountSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcryptjs_1.default.compare(password, this.password);
        return isMatch;
    });
};
accountSchema.virtual("orders", {
    ref: "Order",
    localField: "_id",
    foreignField: "account",
});
accountSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "account",
});
accountSchema.methods.getJwtToken = function () {
    const payload = {
        id: this._id,
        role: this.role,
    };
    return jsonwebtoken_1.default.sign(payload, configs_1.default.JWT_SECRET, {
        expiresIn: "7d",
    });
};
accountSchema.methods.getVerificationToken = function () {
    const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
    this.verificationToken = verificationToken;
    this.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return verificationToken;
};
accountSchema.methods.getPasswordResetToken = function () {
    const passwordResetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.passwordResetToken = passwordResetToken;
    this.passwordResetTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return passwordResetToken;
};
accountSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};
accountSchema.statics.findByCredentials = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email }).select("+password");
        if (user) {
            if (user.isDeleted)
                return null;
            const isMatch = yield user.comparePassword(password);
            console.log({ isMatch });
            return isMatch ? user : null;
        }
        return null;
    });
};
accountSchema.statics.findByIdAndUpdatePassword = function (id, password) {
    const user = this.findById(id);
    user.password = password;
    return user.save();
};
accountSchema.statics.findByVerificationTokenAndVerify = function (verificationToken) {
    const user = this.findOne({ verificationToken });
    if ((0, dayjs_1.default)(user === null || user === void 0 ? void 0 : user.verificationTokenExpiresAt).isBefore((0, dayjs_1.default)())) {
        return null;
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    return user;
};
accountSchema.statics.findByPasswordResetTokenAndReset = function (passwordResetToken, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ passwordResetToken });
        if ((0, dayjs_1.default)(user === null || user === void 0 ? void 0 : user.passwordResetTokenExpiresAt).isBefore((0, dayjs_1.default)())) {
            return null;
        }
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresAt = undefined;
        return user.save();
    });
};
accountSchema.statics.findByIdAndSoftDelete = function (id) {
    const user = this.findById(id);
    user.isDeleted = true;
    return user.save();
};
exports.AccountModel = mongoose_1.default.model("Account", accountSchema);
