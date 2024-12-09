import express from "express";
import { authorizeRoles, isAuthenticatd } from "../middleware/auth";
import {
  getCoursesAnalytics,
  getOrderAnalytics,
  getUsersAnalytics,
} from "../controllers/analytics.controller";
const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-user-analytics",
  isAuthenticatd,
  authorizeRoles("admin"),
  getUsersAnalytics
);
analyticsRouter.get(
  "/get-orders-analytics",
  isAuthenticatd,
  authorizeRoles("admin"),
  getOrderAnalytics
);

analyticsRouter.get(
  "/get-courses-analytics",
  isAuthenticatd,
  authorizeRoles("admin"),
  getCoursesAnalytics
);

export default analyticsRouter;
