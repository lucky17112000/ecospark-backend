import { Router } from "express";
import { categoryRouter } from "../module/category/category.router";

const router = Router();
router.use("/category", categoryRouter);

export const appRouter = router;
