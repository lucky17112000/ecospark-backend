import { Router } from "express";
import { categoryRouter } from "../module/category/category.router";
import { authRouter } from "../module/auth/auth.router";
import { ideaRouter } from "../module/idea/idea.route";
import { feedbackRouter } from "../module/feedback/feedback.router";

import { voteRouter } from "../module/vote/vote.route";

const router = Router();
router.use("/auth", authRouter);
router.use("/category", categoryRouter);
router.use("/idea", ideaRouter);
router.use("/feedback", feedbackRouter);
router.use("/vote", voteRouter);

export const appRouter = router;
