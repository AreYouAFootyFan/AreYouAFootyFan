import express from "express";
import { CategoryController } from "../controllers/category.controller";
import {
  authenticate,
  requireUsername,
  requireRole,
} from "../middleware/auth.middleware";
import { UserRole } from "../utils/enums";

const router = express.Router();

router.use(authenticate);

router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);

router.post(
  "/",
  requireUsername,
  requireRole(UserRole.MANAGER),
  CategoryController.createCategory
);

router.put(
  "/:id",
  requireUsername,
  requireRole(UserRole.MANAGER),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  requireUsername,
  requireRole(UserRole.MANAGER),
  CategoryController.deleteCategory
);

export default router;
