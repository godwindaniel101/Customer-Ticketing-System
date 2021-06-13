import express from "express";
import * as adminSchema from "../auth/auth.schema";
import * as  adminController from "./admin.controller";
import { validateRequest } from "../../middleware";
const router = express.Router();

//Create Admin
router.post("/", validateRequest(adminSchema.register), adminController.create);

// Get all users
router.get("/", adminController.getAllUser);

// Get user with id
router.get("/:userId", adminController.getUser);

// Update users
router.patch("/:userId", adminController.update);

// Delete user route
router.delete("/:userId", adminController.userDelete);

export default router