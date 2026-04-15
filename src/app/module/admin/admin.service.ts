import status from "http-status";
import AppError from "../../errorHelper.ts/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";

const getAllUsersByAdmn = async (user: IRequestUser) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }

  const result = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const deleteOwnAccountFromResult = result.filter(
    (u) => u.email !== user.email,
  );
  return deleteOwnAccountFromResult;
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
  const chkAdmin  =  await prisma.user.findUnique({
    where: { id: user.email },
  })
  if(chkAdmin?.role !== "ADMIN"){
    throw new AppError(
      status.FORBIDDEN,
      "Only admins can access this resource",
    );
  }
  const result  =  await prisma.user.findUnique({
    where:{id: userId},
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  if(!result){
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  return result;
};
export const adminService = {
  getAllUsersByAdmn,
  updateUserRoleByAdmin,
  getOneUserByAdmin,
};
