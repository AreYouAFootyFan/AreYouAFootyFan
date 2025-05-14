import express from "express";
import { CategoryController } from "../controllers/category.controller";
import { authenticate, requireUsername, requireRole } from "../middleware/auth.middleware";
import { User } from "../utils/enums";

const router = express.Router();

// Public routes
router.get("/list", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);

// Protected routes
router.post("/", authenticate, requireUsername, requireRole(User.Role.MANAGER), CategoryController.createCategory);
router.put("/:id", authenticate, requireUsername, requireRole(User.Role.MANAGER), CategoryController.updateCategory);
router.delete("/:id", authenticate, requireUsername, requireRole(User.Role.MANAGER), CategoryController.deleteCategory);

export default router;
