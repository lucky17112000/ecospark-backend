import { Router } from "express";
import { categoryRouter } from "../module/category/category.router";
import { authRouter } from "../module/auth/auth.router";
import { ideaRouter } from "../module/idea/idea.route";
import { feedbackRouter } from "../module/feedback/feedback.router";

const router = Router();
router.use("/auth", authRouter);
router.use("/category", categoryRouter);
router.use("/idea", ideaRouter);
router.use("/feedback", feedbackRouter);

export const appRouter = router;
