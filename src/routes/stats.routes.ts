import express from "express";
import { StatsController } from "../controllers/stats.controller";
import {
  authenticate,
  requireUsername,
  requireRole,
} from "../middleware/auth.middleware";
import { User } from "../utils/enums";

const router = express.Router();

// All routes require authentication and username
router.use(authenticate);
router.use(requireUsername);

// Dashboard stats require manager role
router.get("/dashboard", requireRole(User.Role.MANAGER), StatsController.getDashboardStats);

// User stats endpoint
router.get("/user/:userId", StatsController.getUserStats);

export default router;
