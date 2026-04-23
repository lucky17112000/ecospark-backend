import status from "http-status";
import AppError from "../../errorHelper.ts/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interface/query.interface";
import { QueryBuilder } from "../../utiles/QueryBuilder";
import { Prisma, User } from "../../../generated/prisma/client";

const getAllUsersByAdmn = async (
  user: IRequestUser,
  query: IQueryParams = {},
) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }

  const chkAdmin = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { role: true },
  });

  if (chkAdmin?.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }

  const normalizedQuery: IQueryParams = { ...query };

  const queryBuilder = new QueryBuilder<
    User,
    Prisma.UserWhereInput,
    Prisma.UserInclude
  >(prisma.user, normalizedQuery, {
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
const updateUserRoleByAdmin = async (
  userId: string,
  role: string,
  user: IRequestUser,
) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const chkAdmin = await prisma.user.findUnique({
    where: { id: user.userId },
  });
  if (chkAdmin?.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
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
    data: { role: role as "USER" | "ADMIN" },
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

const getOneUserByAdmin = async (userId: string, user: IRequestUser) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const chkAdmin = await prisma.user.findUnique({
    where: { id: user.userId },
  });
  if (chkAdmin?.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
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

const softDeleteUserByAdmin = async (userId: string, user: IRequestUser) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const chkAdmin = await prisma.user.findUnique({
    where: { id: user.userId },
  });
  if (chkAdmin?.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const userData = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  if (userData.email === user.email) {
    throw new AppError(
      status.BAD_REQUEST,
      "You cannot delete your own account",
    );
  }
  const result = await prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true, deletedAt: new Date() },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      isDeleted: true,
      deletedAt: true,
    },
  });
  return result;
};

const hardDeleteUserByAdmin = async (userId: string, user: IRequestUser) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const chkAdmin = await prisma.user.findUnique({
    where: { id: user.userId },
  });
  if (chkAdmin?.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const userData = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  if (userData.email === user.email) {
    throw new AppError(
      status.BAD_REQUEST,
      "You cannot delete your own account",
    );
  }
  await prisma.user.delete({
    where: { id: userId },
  });
  return { message: "User deleted successfully" };
};

export const adminService = {
  getAllUsersByAdmn,
  updateUserRoleByAdmin,
  getOneUserByAdmin,
  softDeleteUserByAdmin,
  // getDeletedUsersByAdmin,
  hardDeleteUserByAdmin,
};
