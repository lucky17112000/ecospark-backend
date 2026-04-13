import express from "express";
import { prisma } from "./app/lib/prisma.js";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", async (req, res) => {
    const result = await prisma.category.create({
        data: {
            name: "Test",
        },
    });
    res.send(result);
});
export default app;
