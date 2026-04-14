import status from "http-status";
import AppError from "../../errorHelper.ts/AppError";
import { prisma } from "../../lib/prisma";
import { IcreateIdeaPayload, IUpdateIdeaPayload } from "./idea.interface";
import { th } from "zod/locales";
import { IRequestUser } from "../../interface/requestUser.interface";

const createIdea = async (payload: IcreateIdeaPayload) => {
  const {
    title,
    problemStatement,
    solutinon,
    description,
    images,
    categoryId,
    authorId,
    price,
  } = payload;

  const IdeaData = await prisma.idea.create({
    data: {
      title,
      problemStatement,
      solutinon,
      description,
      images,
      categoryId,
      authorId,
      price,
    },
    include: {
      author: true,
      category: true,
      votes: true,
      feedback: true,
      purchases: true,
    },
  });
  return IdeaData;
};

const getAllIdeas = async () => {
  const ideas = await prisma.idea.findMany({
    include: {
      author: true,
      category: true,
      votes: true,
      feedback: true,
      purchases: true,
    },
  });
  return ideas;
};

const getIdeaById = async (id: string) => {
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      votes: true,
      feedback: true,
      purchases: true,
    },
  });
  return idea;
};

const updateIdea = async (id: string, payload: IUpdateIdeaPayload) => {
  const data = payload;
  const dataById = await prisma.idea.findUnique({
    where: { id },
  });
  if (!dataById) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }
  const idea = await prisma.idea.update({
    where: { id },
    data,
    include: {
      author: true,
      category: true,
      votes: true,
      feedback: true,
      purchases: true,
    },
  });
  return idea;
};

const deleteIdea = async (id: string, user: IRequestUser) => {
  if (!id) {
    throw new AppError(status.BAD_REQUEST, "Idea id is required");
  }
  const dataById = await prisma.idea.findUnique({
    where: { id },
    select: {
      isDeleted: true,
      author: {
        select: {
          role: true,
          email: true,
        },
      },
    },
  });

  if (!dataById) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }
  if (!dataById.isDeleted) {
    throw new AppError(status.BAD_REQUEST, "Idea is not deleted yet");
  }
  //   if (dataById?.author.email !== user.email) {
  //     throw new AppError(
  //       status.FORBIDDEN,
  //       "You are not authorized to delete this idea",
  //     );
  //   }
  if (user.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "Only admin can delete this idea permanently",
    );
  }
  const result = await prisma.idea.delete({
    where: { id },
  });

  return result;
};

const deleteIdeaSoft = async (id: string, user: IRequestUser) => {
  if (!id) {
    throw new AppError(status.BAD_REQUEST, "Idea id is required");
  }

  const dataById = await prisma.idea.findUnique({
    where: { id },
    select: { id: true, isDeleted: true, authorId: true },
  });

  if (!dataById) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  if (dataById.authorId !== user.userId) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to delete this idea",
    );
  }
  if (dataById?.isDeleted) {
    throw new AppError(
      status.BAD_REQUEST,
      "Idea is already get permission for deleted",
    );
  }

  const result = await prisma.idea.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
  return result;
};

export const ideaService = {
  createIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  deleteIdeaSoft,
};
