import status from "http-status";
import AppError from "../../errorHelper.ts/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreatePurchasePayload } from "./purchase.interface";

const createPurchase = async (
  payload: ICreatePurchasePayload,
  user: IRequestUser,
) => {
  const { ideaId } = payload;
  const ideaData = await prisma.idea.findUnique({
    where: { id: ideaId },
  });

  if (!ideaData) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }
  const alreadyPurchesd = await prisma.purchase.findFirst({
    where: {
      ideaId,
      userId: user.userId,
    },
  });
  if (alreadyPurchesd) {
    throw new AppError(
      status.BAD_REQUEST,
      "You have already purchased this idea",
    );
  }

  const result = await prisma.purchase.create({
    data: {
      ideaId,
      userId: user.userId,
    },
    include: {
      idea: true,
      user: true,
    },
  });
  return result;
};

const getAllPurchases = async () => {
  const result = await prisma.purchase.findMany({
    include: {
      idea: true,
      user: true,
    },
  });
  return result;
};

const getIndividualPurchase = async (user: IRequestUser) => {
  const IdeaData = await prisma.purchase.findMany({
    where: {
      userId: user.userId,
    },
    include: { idea: true, user: true },
  });
  return IdeaData;
};
export const purchaseService = {
  createPurchase,
  getAllPurchases,
  getIndividualPurchase,
};
