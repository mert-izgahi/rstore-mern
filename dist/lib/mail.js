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
const nodemailer_1 = __importDefault(require("nodemailer"));
const configs_1 = __importDefault(require("../configs"));
const logger_1 = require("./logger");
class MailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: configs_1.default.MAIL_HOST,
            port: 2525,
            auth: {
                user: configs_1.default.MAIL_USER,
                pass: configs_1.default.MAIL_PASS,
            },
        });
    }
    sendEmail(to, subject, html) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield this.transporter.sendMail({
                from: configs_1.default.MAIL_FROM,
                to,
                subject,
                html,
            });
            logger_1.logger.info("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
        });
    }
    sendWelcomeEmail(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = "Welcome to the App";
            const html = `
      <h1>Welcome ${name}</h1>
      <p>Thank you for signing up</p>
    `;
            yield this.sendEmail(email, subject, html);
        });
    }
    sendPasswordResetEmail(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = "Password Reset";
            const html = `
      <h1>Password Reset</h1>
      <p>Click <a href="${configs_1.default.CLIENT_URL}/auth/reset-password?token=${token}">here</a> to reset your password</p>
    `;
            yield this.sendEmail(email, subject, html);
        });
    }
    sendVerificationEmail(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = "Email Verification";
            const html = `
      <h1>Email Verification</h1>
      <p>Click <a href="${configs_1.default.CLIENT_URL}/auth/verify-email?token=${token}">here</a> to verify your email</p>
    `;
            yield this.sendEmail(email, subject, html);
        });
    }
}
const mailService = new MailService();
exports.default = mailService;
