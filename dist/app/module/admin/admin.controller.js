import { catchasync } from "../../../shared/cathAsync";
import AppError from "../../errorHelper.ts/AppError";
import status from "http-status";
import { adminService } from "./admin.service";
import { sendResponse } from "../../../shared/sendResponse";
const getAllUsersByAdmin = catchasync(async (req, res) => {
    if (!req.user) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized");
    }
    const query = req.query;
    const result = await adminService.getAllUsersByAdmn(req.user, query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        data: result.data,
        meta: result.meta,
        message: "All users retrieved successfully",
    });
});
const updateUserRoleByAdmin = catchasync(async (req, res) => {
    if (!req.user) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized");
    }
    const { userId } = req.params;
    const { role } = req.body;
    const result = await adminService.updateUserRoleByAdmin(userId, role, req.user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        data: result,
        message: "User role updated successfully",
    });
});
const getOneUserByAdmin = catchasync(async (req, res) => {
    if (!req.user) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized");
    }
    const { userId } = req.params;
    const result = await adminService.getOneUserByAdmin(userId, req.user);
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
