import { Request, Response } from "express";
import { catchasync } from "../../../shared/cathAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";

const registerUser = catchasync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.registrationUser(payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

export const authController = {
  registerUser,
};
