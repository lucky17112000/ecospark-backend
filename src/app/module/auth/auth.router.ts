import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();
router.post("/register", authController.registerUser);
router.post("/verify-email", authController.verifyEmail);
router.post("/login", authController.logInUser);
router.get("/me", authController.getMe);

export const authRouter = router;
