import { Request, Response } from "express";
import { AccountModel } from "../models/account.model";
import { ApiError } from "../lib/api-error";
import mailService from "../lib/mail";

export const signUp = async (req: Request, res: Response) => {
  const { email } = req.body;
  const existingAccount = await AccountModel.findByEmail(email);
  if (existingAccount) throw ApiError.duplicatedEmail();
  const account = await AccountModel.create(req.body);

  const jwtToken = account.getJwtToken();
  await mailService.sendWelcomeEmail(email, account.firstName);
  res
    .cookie("token", jwtToken, { httpOnly: true, sameSite: "lax" })
    .status(201)
    .json({
      status: 201,
      message: "Account created successfully",
      title: "Success",
      data: account,
    });
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const account = await AccountModel.findByCredentials(email, password);
  console.log({ account });

  if (!account) throw ApiError.invalidCredentials();
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
};

export const signOut = async (req: Request, res: Response) => {
  res
    .clearCookie("token", { httpOnly: true, sameSite: "none" })
    .status(200)
    .json({
      status: 200,
      message: "Account logged out successfully",
      title: "Success",
    });
};

export const getMyAccount = async (req: Request, res: Response) => {
  const { currentUserId } = res.locals;
  const account = await AccountModel.findById(currentUserId).populate("orders reviews");
  if (!account) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    data: account,
    title: "Success",
  });
};

export const updateAccountById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const account = await AccountModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!account) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    data: account,
    title: "Success",
  });
};


export const toggleBlockById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const account = await AccountModel.findById(id);
  if (!account) throw ApiError.notFound();

  account.isBlocked = !account.isBlocked;
  await account.save();

  res.status(200).json({
    status: 200,
    data: account,
    title: "Success",
  });
};

export const toggleDeleteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const account = await AccountModel.findById(id);
  if (!account) throw ApiError.notFound();

  account.isDeleted = !account.isDeleted;
  await account.save();

  res.status(200).json({
    status: 200,
    data: account,
    title: "Success",
  });
};

export const updatePassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;
  const account = await AccountModel.findByIdAndUpdatePassword(id, password);
  if (!account) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    data: account,
    title: "Success",
  });
};

export const sendVerificationEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const account = await AccountModel.findById(id);
  if(!account) throw ApiError.notFound();
  const verificationToken = account?.getVerificationToken();
  await mailService.sendVerificationEmail(account?.email, verificationToken);
  res.status(200).json({
    status: 200,
    data: verificationToken,
    title: "Success",
  });
};

export const verifyAccount = async (req: Request, res: Response) => {
  const { verificationToken } = req.body;
  const account = await AccountModel.findByVerificationTokenAndVerify(
    verificationToken
  );
  if (!account) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    data: account,
    title: "Success",
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const account = await AccountModel.findByEmail(email);
  if (!account) throw ApiError.notFound();
  const passwordResetToken = account?.getPasswordResetToken();
  await account.save();
  await mailService.sendPasswordResetEmail(email, passwordResetToken);
  res.status(200).json({
    status: 200,
    data: account,
    title: "Success",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const { passwordResetToken } = req.params;
  
  
  const account = await AccountModel.findByPasswordResetTokenAndReset(
    passwordResetToken,
    password
  );
  if (!account) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    data: account,
    title: "Success",
  });
};

// Admin
export const getAccounts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const { search } = req.query;
  const queryObj = {} as any;

  if (search) {
    queryObj["$or"] = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const accounts = await AccountModel.find(queryObj).skip(skip).limit(limit);

  const count = await AccountModel.countDocuments(queryObj);
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
};

export const getAccountById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const account = await AccountModel.findById(id);
  if (!account) throw ApiError.notFound();
  res.status(200).json({
    status: 200,
    data: account,
    title: "Success",
  });
};