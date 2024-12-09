import express from "express";
import { authorizeRoles, isAuthenticatd } from "../middleware/auth";
import { createOrder } from "../controllers/order.controller";
const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticatd, createOrder);

orderRouter.post(
  "/get-orders",
  isAuthenticatd,
  authorizeRoles("admin"),
  createOrder
);

export default orderRouter;
