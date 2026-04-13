import { NextFunction, Router } from "express";
import { categoryController } from "./category.controller";
import z from "zod";
import { validateRequest } from "../../midddlware/validateRequest";
import {
  createDoctorZodSchema,
  updateDoctorZodSchema,
} from "./category.validate";

const router = Router();
router.post(
  "/",
  validateRequest(createDoctorZodSchema),
  categoryController.createCategory,
);
router.get("/", categoryController.getAllCategory);
router.get("/:id", categoryController.getCategoryById);
router.put(
  "/:id",
  validateRequest(updateDoctorZodSchema),
  categoryController.updateCategory,
);
router.delete("/:id", categoryController.deleteCategory);

// router.post("/bnbn", );
export const categoryRouter = router;
