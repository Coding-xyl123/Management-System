import express from "express";
import { authorizeRoles, isAuthenticatd } from "../middleware/auth";
import { getNotifications } from "../controllers/notification.controller";
import exp from "constants";
const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notification",
  authorizeRoles("admin"),
  getNotifications
);

notificationRouter.put(
  "/update-notification/:id",
  isAuthenticatd,
  authorizeRoles("admin"),
  getNotifications
);

export default notificationRouter;
