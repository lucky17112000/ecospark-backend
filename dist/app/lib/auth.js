import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { Role, USER_STATUS } from "../../generated/prisma/enums.js";
import { bearer, emailOTP, oAuthProxy } from "better-auth/plugins";
import { sendEmail } from "../utiles/email.js";
import { envVars } from "../config/env.js";
// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from "@/generated/prisma/client";
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    baseURL: envVars.FRONTEND_URL,
    trustedOrigins: [envVars.FRONTEND_URL],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: Role.USER,
            },
            status: {
                type: "string",
                required: true,
                defaultValue: USER_STATUS.ACTIVE,
            },
            needPasswordChange: {
                type: "boolean",
                required: true,
                defaultValue: false,
            },
            isDeleted: {
                type: "boolean",
                required: true,
                defaultValue: false,
            },
            deletedAt: {
                type: "date",
                required: false,
                defaultValue: null,
            },
        },
    },
    plugins: [
        oAuthProxy(),
        bearer(),
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "email-verification") {
                    const user = await prisma.user.findUnique({
                        where: { email },
                    });
                    if (user) {
                        await sendEmail({
                            to: email,
                            subject: "Verify your email",
                            templateName: "otp", //for deployment
                            // templateName: "otp",
                            templateData: {
                                name: user.name,
                                otp,
                            },
                        });
                    }
                }
                else if (type === "forget-password") {
                    const user = await prisma.user.findUnique({
                        where: { email },
                    });
                    if (user) {
                        await sendEmail({
                            to: email,
                            subject: "Reset your password",
                            templateName: "password-reset",
                            templateData: {
                                name: user.name,
                                otp,
                            },
                        });
                    }
                }
            },
            expiresIn: 2 * 60,
            otpLength: 6,
        }),
    ],
    session: {
        expiresIn: 60 * 60 * 60 * 24, // 1 day in seconds
        updateAge: 60 * 60 * 60 * 24, // 1 day in seconds
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 60 * 24, // 1 day in seconds
        },
    },
    advanced: {
        // disableCSRFCheck: true,
        useSecureCookies: false,
        cookies: {
            state: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/",
                },
            },
            sessionToken: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/",
                },
            },
        },
    },
});
