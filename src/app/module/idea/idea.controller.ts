import { Request, Response } from "express";
import { ideaService } from "./idea.services";
import { IcreateIdeaPayload } from "./idea.interface";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { IRequestUser } from "../../interface/requestUser.interface";
import AppError from "../../errorHelper.ts/AppError";

const createIdea = async (req: Request, res: Response) => {
  // console.log("Request body:", req.body);
  console.log("Request files:", req.files);
  const data = {
    ...req.body,
    images: (req.files as Express.Multer.File[]).map((file) => file.path),
  };
  const result = await ideaService.createIdea(data as IcreateIdeaPayload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Idea created successfully",
    data: result,
  });
};

const getAllIdeas = async (req: Request, res: Response) => {
  const result = await ideaService.getAllIdeas();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea retrived successfully",
    data: result,
  });
};
const getIdeayId = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ideaService.getIdeaById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea retrived successfully",
    data: result,
  });
};

const updateIdea = async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const result = await ideaService.updateIdea(id as string, data);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea updated successfully",
    data: result,
  });
};
const deleteIdea = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    throw new AppError(status.BAD_REQUEST, "Idea id is required");
  }
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
  }
  const result = await ideaService.deleteIdea(
    id as string,
    req.user as IRequestUser,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea deleted successfully",
    data: result,
  });
};

const deleteIdeaSoft = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    throw new AppError(status.BAD_REQUEST, "Idea id is required");
  }
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
  }
  const result = await ideaService.deleteIdeaSoft(
    id as string,
    req.user as IRequestUser,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea soft deleted successfully",
    data: result,
  });
};

export const ideaController = {
  createIdea,
  getAllIdeas,
  getIdeayId,
  updateIdea,
  deleteIdea,
  deleteIdeaSoft,
};
