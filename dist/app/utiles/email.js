import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import AppError from "../errorHelper.ts/AppError";
import status from "http-status";
import path from "path";
import ejs from "ejs";
const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_HOST,
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_USER,
        pass: envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_PASS,
    },
    port: Number(envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_PORT),
});
export const sendEmail = async ({ to, subject, templateName, templateData, attachments, }) => {
    try {
        const templatePath = path.resolve(process.cwd(), "src/app/templates", `${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, templateData);
        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.EMAIL_SENDER_SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            })),
        });
        console.log(info, "Email sent successfully");
    }
    catch (error) {
        console.log("Error sending email", error);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
    }
};
