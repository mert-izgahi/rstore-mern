import nodemailer from "nodemailer";
import configs from "../configs";
import { logger } from "./logger";



class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: configs.MAIL_HOST,
      port: 2525,
      auth: {
        user: configs.MAIL_USER,
        pass: configs.MAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    const info = await this.transporter.sendMail({
      from: configs.MAIL_FROM,
      to,
      subject,
      html,
    });
    logger.info("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }

  async sendWelcomeEmail(email: string, name: string) {
    const subject = "Welcome to the App";
    const html = `
      <h1>Welcome ${name}</h1>
      <p>Thank you for signing up</p>
    `;
    await this.sendEmail(email, subject, html);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const subject = "Password Reset";
    const html = `
      <h1>Password Reset</h1>
      <p>Click <a href="${configs.CLIENT_URL}/auth/reset-password?token=${token}">here</a> to reset your password</p>
    `;
    await this.sendEmail(email, subject, html);
  }

  async sendVerificationEmail(email: string, token: string) {
    const subject = "Email Verification";
    const html = `
      <h1>Email Verification</h1>
      <p>Click <a href="${configs.CLIENT_URL}/auth/verify-email?token=${token}">here</a> to verify your email</p>
    `;
    await this.sendEmail(email, subject, html);
  }
}


const mailService = new MailService();

export default mailService;