import { Request, Response } from "express";
import { catchasync } from "../../../shared/cathAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { auth } from "../../lib/auth";
import { tokenUtil } from "../../utiles/token";
import AppError from "../../errorHelper.ts/AppError";

const registerUser = catchasync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.registrationUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtil.setAccessTokenCookie(res, accessToken);
  tokenUtil.setRefreshTokenCookie(res, refreshToken);
  tokenUtil.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const verifyEmail = catchasync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await authService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Email verified successfully",
  });
});

const logInUser = catchasync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.logInUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtil.setAccessTokenCookie(res, accessToken);
  tokenUtil.setRefreshTokenCookie(res, refreshToken);
  tokenUtil.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const getMe = catchasync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized");
  }
  const result = await authService.getMe(req.user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});
const getNewToken = catchasync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const sessionToken = req.cookies["better-auth.session_token"];

  const result = await authService.getNewToken(refreshToken, sessionToken);
  const {
    accessToken,
    refreshToken: newRefreshToken,
    sessionToken: newSessionToken,
  } = result;
  tokenUtil.setAccessTokenCookie(res, accessToken);
  tokenUtil.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtil.setBetterAuthSessionCookie(res, newSessionToken);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "New access token generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken: newSessionToken,
    },
  });
});

const changePassword = catchasync(async (req: Request, res: Response) => {
  const sessionToken = req.cookies["better-auth.session_token"];
  const payload = req.body;
  const result = await authService.changePassword(payload, sessionToken);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const forgetPassword = catchasync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.forgetPassword(email);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password reset OTP sent successfully",
    data: result,
  });
});

export const authController = {
  registerUser,
  verifyEmail,
  logInUser,
  getMe,
  getNewToken,
  changePassword,
  forgetPassword,
};
