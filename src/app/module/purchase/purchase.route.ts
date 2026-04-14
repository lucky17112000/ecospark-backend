import { Router } from "express";
import { purchaseController } from "./purchase.controller";
import { cheakAuth } from "../../midddlware/cheakAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post("/", cheakAuth(Role.USER), purchaseController.createPurchase);

router.get("/", cheakAuth(Role.ADMIN), purchaseController.getAllPurchases);
router.get(
  "/me",
  cheakAuth(Role.USER),
  purchaseController.getIndividualPurchase,
);
export const purchaseRouter = router;
