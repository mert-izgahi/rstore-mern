import mongoose, { Document } from "mongoose";
import { Role } from "../lib/enums";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import configs from "../configs";
import crypto from "crypto";
import dayjs from "dayjs";
export interface IAccountDocument extends Document {
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

  passwordResetToken?: string;
  passwordResetTokenExpiresAt: Date;

  isDeleted: boolean;
  isBlocked: boolean;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: Date;
  lastSignInAt: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  getJwtToken(): string;
  getVerificationToken(): string;
  getPasswordResetToken(): string;
}

export interface IAccountModel extends mongoose.Model<IAccountDocument> {
  findByEmail(email: string): Promise<IAccountDocument | null>;
  findByCredentials(
    email: string,
    password: string
  ): Promise<IAccountDocument | null>;
  findByIdAndUpdatePassword(
    id: string,
    password: string
  ): Promise<IAccountDocument | null>;

  findByVerificationTokenAndVerify(
    verificationToken: string
  ): Promise<IAccountDocument | null>;

  findByPasswordResetTokenAndReset(
    passwordResetToken: string,
    password: string
  ): Promise<IAccountDocument | null>;

  findByIdAndSoftDelete(id: string): Promise<IAccountDocument | null>;
}

const accountSchema = new mongoose.Schema<IAccountDocument>(
  {
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
      default: Role.USER,
      required: true,
      enum: Object.values(Role),
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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

accountSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

accountSchema.methods.comparePassword = async function (password: string) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

accountSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "account",
})

accountSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "account",
})

accountSchema.methods.getJwtToken = function () {
  const payload = {
    id: this._id as string,
    role: this.role as string,
  };

  return jwt.sign(payload, configs.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

accountSchema.methods.getVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.verificationToken = verificationToken;
  this.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return verificationToken;
};

accountSchema.methods.getPasswordResetToken = function () {
  const passwordResetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = passwordResetToken;
  this.passwordResetTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return passwordResetToken;
};

accountSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email });
};

accountSchema.statics.findByCredentials = async function (
  email: string,
  password: string
) {
  const user = await this.findOne({ email }).select("+password");

  if (user) {
    if (user.isDeleted) return null;
    const isMatch = await user.comparePassword(password);
    console.log({ isMatch });

    return isMatch ? user : null;
  }
  return null;
};

accountSchema.statics.findByIdAndUpdatePassword = function (
  id: string,
  password: string
) {
  const user = this.findById(id);
  user.password = password;
  return user.save();
};

accountSchema.statics.findByVerificationTokenAndVerify = function (
  verificationToken: string
) {
  const user = this.findOne({ verificationToken });
  if (dayjs(user?.verificationTokenExpiresAt).isBefore(dayjs())) {
    return null;
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;

  return user;
};

accountSchema.statics.findByPasswordResetTokenAndReset = async function (
  passwordResetToken: string,
  password: string
) {
  const user = await this.findOne({ passwordResetToken });
  if (dayjs(user?.passwordResetTokenExpiresAt).isBefore(dayjs())) {
    return null;
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresAt = undefined;
  return user.save();
};

accountSchema.statics.findByIdAndSoftDelete = function (id: string) {
  const user = this.findById(id);
  user.isDeleted = true;
  return user.save();
};

export const AccountModel = mongoose.model<IAccountDocument, IAccountModel>(
  "Account",
  accountSchema
);
