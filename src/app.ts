import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { appRouter } from "./app/routes";
import cookieParser from "cookie-parser";
import { PaymentController } from "./app/module/payment/payment.controller";

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent,
);

/**!SECTION
 * 
 * app.use(
  cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);
 */

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", appRouter);

export default app;
