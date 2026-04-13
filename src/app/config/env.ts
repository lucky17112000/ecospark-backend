import dotenv from "dotenv";
import AppError from "../errorHelper.ts/AppError";
import status from "http-status";
// import e from "express";
dotenv.config();
/*


EMAIL_SENDER_SMTP_USER=asaduzzamanalamin17112000@gmail.com
EMAIL_SENDER_SMTP_PASS=fwxh nuht wiad wuwo
EMAIL_SENDER_SMTP_HOST=smtp.gmail.com
EMAIL_SENDER_SMTP_PORT=465
EMAIL_SENDER_SMTP_FROM=asaduzzamanalamin17112000@gmail.com
*/

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  EMAIL_SENDER: {
    EMAIL_SENDER_SMTP_USER: string;
    EMAIL_SENDER_SMTP_PASS: string;
    EMAIL_SENDER_SMTP_HOST: string;
    EMAIL_SENDER_SMTP_PORT: string;
    EMAIL_SENDER_SMTP_FROM: string;
  };
}
const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVars = [
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "NODE_ENV",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
  ];
  requiredEnvVars.forEach((variable: string) => {
    if (!process.env[variable]) {
      // throw new Error(`Environment variable ${variable} is required but not set in .env file.`);
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set in .env file.`,
      );
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    EMAIL_SENDER: {
      EMAIL_SENDER_SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
      EMAIL_SENDER_SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS as string,
      EMAIL_SENDER_SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
      EMAIL_SENDER_SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT as string,
      EMAIL_SENDER_SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM as string,
    },
  };
};
export const envVars = loadEnvVariables();
