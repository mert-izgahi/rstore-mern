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
exports.getAccountById = exports.getAccounts = exports.resetPassword = exports.forgotPassword = exports.verifyAccount = exports.sendVerificationEmail = exports.updatePassword = exports.toggleDeleteById = exports.toggleBlockById = exports.updateAccountById = exports.getMyAccount = exports.signOut = exports.authAsGuest = exports.signIn = exports.signUp = void 0;
const account_model_1 = require("../models/account.model");
const api_error_1 = require("../lib/api-error");
const mail_1 = __importDefault(require("../lib/mail"));
const enums_1 = require("../lib/enums");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const existingAccount = yield account_model_1.AccountModel.findByEmail(email);
    if (existingAccount)
        throw api_error_1.ApiError.duplicatedEmail();
    const account = yield account_model_1.AccountModel.create(req.body);
    const jwtToken = account.getJwtToken();
    yield mail_1.default.sendWelcomeEmail(email, account.firstName);
    res
        .cookie("token", jwtToken, { httpOnly: true, sameSite: "lax" })
        .status(201)
        .json({
        status: 201,
        message: "Account created successfully",
        title: "Success",
        data: account,
    });
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const account = yield account_model_1.AccountModel.findByCredentials(email, password);
    if (!account)
        throw api_error_1.ApiError.invalidCredentials();
    const jwtToken = account.getJwtToken();
    res
        .cookie("token", jwtToken, { httpOnly: true, sameSite: "lax" })
        .status(200)
        .json({
        status: 200,
        message: "Account logged in successfully",
        title: "Success",
        data: account,
    });
});
exports.signIn = signIn;
const authAsGuest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield account_model_1.AccountModel.findOne({ role: enums_1.Role.GUEST });
    if (!account)
        throw api_error_1.ApiError.notFound();
    const jwtToken = account.getJwtToken();
    res
        .cookie("token", jwtToken, { httpOnly: true, sameSite: "lax" })
        .status(200)
        .json({
        status: 200,
        message: "Account logged in successfully",
        title: "Success",
        data: account,
    });
});
exports.authAsGuest = authAsGuest;
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .clearCookie("token", { httpOnly: true, sameSite: "none" })
        .status(200)
        .json({
        status: 200,
        message: "Account logged out successfully",
        title: "Success",
    });
});
exports.signOut = signOut;
const getMyAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentUserId } = res.locals;
    const account = yield account_model_1.AccountModel.findById(currentUserId).populate("orders reviews");
    if (!account)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        data: account,
        title: "Success",
    });
});
exports.getMyAccount = getMyAccount;
const updateAccountById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const account = yield account_model_1.AccountModel.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    if (!account)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        data: account,
        title: "Success",
    });
});
exports.updateAccountById = updateAccountById;
const toggleBlockById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const account = yield account_model_1.AccountModel.findById(id);
    if (!account)
        throw api_error_1.ApiError.notFound();
    account.isBlocked = !account.isBlocked;
    yield account.save();
    res.status(200).json({
        status: 200,
        data: account,
        title: "Success",
    });
});
exports.toggleBlockById = toggleBlockById;
const toggleDeleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const account = yield account_model_1.AccountModel.findById(id);
    if (!account)
        throw api_error_1.ApiError.notFound();
    account.isDeleted = !account.isDeleted;
    yield account.save();
    res.status(200).json({
        status: 200,
        data: account,
        title: "Success",
    });
});
exports.toggleDeleteById = toggleDeleteById;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { password } = req.body;
    const account = yield account_model_1.AccountModel.findByIdAndUpdatePassword(id, password);
    if (!account)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        data: account,
        title: "Success",
    });
});
exports.updatePassword = updatePassword;
const sendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const account = yield account_model_1.AccountModel.findById(id);
    if (!account)
        throw api_error_1.ApiError.notFound();
    const verificationToken = account === null || account === void 0 ? void 0 : account.getVerificationToken();
    yield mail_1.default.sendVerificationEmail(account === null || account === void 0 ? void 0 : account.email, verificationToken);
    res.status(200).json({
        status: 200,
        data: verificationToken,
        title: "Success",
    });
});
exports.sendVerificationEmail = sendVerificationEmail;
const verifyAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { verificationToken } = req.body;
    const account = yield account_model_1.AccountModel.findByVerificationTokenAndVerify(verificationToken);
    if (!account)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        data: account,
        title: "Success",
    });
});
exports.verifyAccount = verifyAccount;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const account = yield account_model_1.AccountModel.findByEmail(email);
    if (!account)
        throw api_error_1.ApiError.notFound();
    const passwordResetToken = account === null || account === void 0 ? void 0 : account.getPasswordResetToken();
    yield account.save();
    yield mail_1.default.sendPasswordResetEmail(email, passwordResetToken);
    res.status(200).json({
        status: 200,
        data: account,
        title: "Success",
    });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const { passwordResetToken } = req.params;
    const account = yield account_model_1.AccountModel.findByPasswordResetTokenAndReset(passwordResetToken, password);
    if (!account)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        data: account,
        title: "Success",
    });
});
exports.resetPassword = resetPassword;
// Admin
const getAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search } = req.query;
    const queryObj = {};
    if (search) {
        queryObj["$or"] = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }
    const accounts = yield account_model_1.AccountModel.find(queryObj).skip(skip).limit(limit);
    const count = yield account_model_1.AccountModel.countDocuments(queryObj);
    const pages = Math.ceil(count / limit);
    const hasNextPage = page < pages;
    const hasPrevPage = page > 1;
    res.status(200).json({
        status: 200,
        data: {
            records: accounts,
            pagination: {
                page,
                limit,
                pages,
                count,
                hasNextPage,
                hasPrevPage,
            },
        },
        title: "Success",
    });
});
exports.getAccounts = getAccounts;
const getAccountById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const account = yield account_model_1.AccountModel.findById(id);
    if (!account)
        throw api_error_1.ApiError.notFound();
    res.status(200).json({
        status: 200,
        data: account,
        title: "Success",
    });
});
exports.getAccountById = getAccountById;
