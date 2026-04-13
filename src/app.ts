import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { appRouter } from "./app/routes";
import cookieParser from "cookie-parser";

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", appRouter);

export default app;
