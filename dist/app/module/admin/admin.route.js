import { Router } from "express";
import { cheakAuth } from "../../midddlware/cheakAuth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";
const router = Router();
router.get("/users", cheakAuth(Role.ADMIN), adminController.getAllUsersByAdmin);
router.get("/users/:userId", cheakAuth(Role.ADMIN), adminController.getOneUserByAdmin);
router.patch("/users/role/:userId", cheakAuth(Role.ADMIN), adminController.updateUserRoleByAdmin);
router.delete("/users/delete/:userId", cheakAuth(Role.ADMIN), adminController.hardDeleteUserByAdmin);
// router.delete(
export const adminRoute = router;
