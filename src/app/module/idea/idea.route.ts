import { Router } from "express";
import { ideaController } from "./idea.controller";
import { validateRequest } from "../../midddlware/validateRequest";
import { ideaValidator } from "./idea.valiators";
import { cheakAuth } from "../../midddlware/cheakAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post(
  "/",
  validateRequest(ideaValidator.createIdeaZodSchema),
  ideaController.createIdea,
);
router.get("/", ideaController.getAllIdeas);
router.get("/:id", ideaController.getIdeayId);
router.put("/:id", ideaController.updateIdea);
router.delete("/:id", cheakAuth(Role.ADMIN), ideaController.deleteIdea);
router.delete("/soft/:id", cheakAuth(Role.USER), ideaController.deleteIdeaSoft);

export const ideaRouter = router;
