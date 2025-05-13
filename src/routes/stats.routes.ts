import express from "express";
import { StatsController } from "../controllers/stats.controller";
import {
  authenticate,
  requireUsername,
  requireRole,
} from "../middleware/auth.middleware";
import { User } from "../utils/enums";

const router = express.Router();

router.use(authenticate);
router.use(requireUsername);

router.get("/dashboard", requireRole(User.Role.MANAGER), StatsController.getDashboardStats);

router.get("/user/:userId", StatsController.getUserStats);

export default router;
