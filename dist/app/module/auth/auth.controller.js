import { catchasync } from "../../../shared/cathAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { tokenUtil } from "../../utiles/token";
import AppError from "../../errorHelper.ts/AppError";
const registerUser = catchasync(async (req, res) => {
    const payload = req.body;
    const result = await authService.registrationUser(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtil.setAccessTokenCookie(res, accessToken);
    tokenUtil.setRefreshTokenCookie(res, refreshToken);
    tokenUtil.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});
const verifyEmail = catchasync(async (req, res) => {
    const { email, otp } = req.body;
    await authService.verifyEmail(email, otp);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Email verified successfully",
    });
});
const logInUser = catchasync(async (req, res) => {
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
const getMe = catchasync(async (req, res) => {
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
export const authController = {
    registerUser,
    verifyEmail,
    logInUser,
    getMe,
};
