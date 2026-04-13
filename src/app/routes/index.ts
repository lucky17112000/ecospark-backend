import { Router } from "express";
import { categoryRouter } from "../module/category/category.router";
import { authRouter } from "../module/auth/auth.router";

const router = Router();
router.use("/auth", authRouter);
router.use("/category", categoryRouter);

export const appRouter = router;
