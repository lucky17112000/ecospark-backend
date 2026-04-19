import status from "http-status";
import AppError from "../../errorHelper.ts/AppError";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utiles/QueryBuilder";
const getAllUsersByAdmn = async (user, query = {}) => {
    if (user.role !== "ADMIN") {
        throw new AppError(status.FORBIDDEN, "Only admins can access this resource");
    }
    const chkAdmin = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { role: true },
    });
    if (chkAdmin?.role !== "ADMIN") {
        throw new AppError(status.FORBIDDEN, "Only admins can access this resource");
    }
    const normalizedQuery = { ...query };
    const queryBuilder = new QueryBuilder(prisma.user, normalizedQuery, {
        searchableFields: ["email", "id"],
        filterableFields: ["createdAt", "updatedAt", "role"],
    });
    const result = await queryBuilder
        .search()
        .filter()
        .sort()
        .paginate()
        .include({
        _count: {
            select: {
                ideas: true,
                feedbacks: true,
                votes: true,
                payments: true,
                purchases: true,
            },
        },
    })
        .execute();
    return result;
};
const updateUserRoleByAdmin = async (userId, role, user) => {
    if (user.role !== "ADMIN") {
        throw new AppError(status.FORBIDDEN, "Only admins can access this resource");
    }
    const chkAdmin = await prisma.user.findUnique({
        where: { id: user.userId },
    });
    if (chkAdmin?.role !== "ADMIN") {
        throw new AppError(status.FORBIDDEN, "Only admins can access this resource");
    }
    const userData = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!userData) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    if (userData.email === user.email) {
        throw new AppError(status.BAD_REQUEST, "You cannot change your own role");
    }
    const result = await prisma.user.update({
        where: { id: userId },
        data: { role: role },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
};
const getOneUserByAdmin = async (userId, user) => {
    if (user.role !== "ADMIN") {
        throw new AppError(status.FORBIDDEN, "Only admins can access this resource");
    }
    const chkAdmin = await prisma.user.findUnique({
        where: { id: user.userId },
    });
    if (chkAdmin?.role !== "ADMIN") {
        throw new AppError(status.FORBIDDEN, "Only admins can access this resource");
    }
    const result = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!result) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    return result;
};
export const adminService = {
    getAllUsersByAdmn,
    updateUserRoleByAdmin,
    getOneUserByAdmin,
};
