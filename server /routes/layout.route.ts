import express from "express";
import { isAbsolute } from "path";
import { authorizeRoles, isAuthenticatd } from "../middleware/auth";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/Layout.controller";
import { get } from "http";

const layoutRouter = express.Router();

layoutRouter.post(
  "/create-layout",
  isAuthenticatd,
  authorizeRoles("admin"),
  createLayout
);

layoutRouter.put(
  "/edit-layout",
  isAuthenticatd,
  authorizeRoles("admin"),
  editLayout
);
layoutRouter.put(
  "/get-layout",

  getLayoutByType
);
export default layoutRouter;
