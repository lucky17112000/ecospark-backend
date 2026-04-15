import { Request, Response } from "express";
import { catchasync } from "../../../shared/cathAsync";
import AppError from "../../errorHelper.ts/AppError";
import status from "http-status";
import { adminService } from "./admin.service";
import { IRequestUser } from "../../interface/requestUser.interface";
import { sendResponse } from "../../../shared/sendResponse";

const getAllUsersByAdmin = catchasync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized");
  }
  const result = await adminService.getAllUsersByAdmn(req.user as IRequestUser);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    data: result,
    message: "All users retrieved successfully",
  });
});

const updateUserRoleByAdmin = catchasync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized");
    }
    const { userId } = req.params;
    const { role } = req.body;
    const result = await adminService.updateUserRoleByAdmin(
      userId as string,
      role,
      req.user as IRequestUser,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      data: result,
      message: "User role updated successfully",
    });
  },
);

const getOneUserByAdmin = catchasync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized");
  }
  const { userId } = req.params;
  const result = await adminService.getOneUserByAdmin(
    userId as string,
    req.user as IRequestUser,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    data: result,
    message: "User retrieved successfully",
  });
});

export const adminController = {
  getAllUsersByAdmin,
  updateUserRoleByAdmin,
  getOneUserByAdmin,
};
