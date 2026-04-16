import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { appRouter } from "./app/routes";
import cookieParser from "cookie-parser";
import { PaymentController } from "./app/module/payment/payment.controller";
import cron from "node-cron";
import { ideaService } from "./app/module/idea/idea.services";
import { envVars } from "./app/config/env";
import cors from "cors";

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent,
);

/**!SECTION
 *
 *
 */
app.use(
  cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json());
app.use(cookieParser());

// Every 2 seconds (node-cron supports a 6-field format: second minute hour day month weekDay)
cron.schedule("*/30 * * * *", async () => {
  try {
    console.log("Running cron job to update idea status...");
    await ideaService.deleteByCornJobwhenSoftDeleted();
  } catch (error) {
    console.error("Error running cron job:", error);
  }
});

app.use("/api/v1", appRouter);

export default app;
