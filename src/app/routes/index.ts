import { Router } from "express";
import { categoryRouter } from "../module/category/category.router";
import { authRouter } from "../module/auth/auth.router";
import { ideaRouter } from "../module/idea/idea.route";

const router = Router();
router.use("/auth", authRouter);
router.use("/category", categoryRouter);
router.use("/idea", ideaRouter);

export const appRouter = router;
