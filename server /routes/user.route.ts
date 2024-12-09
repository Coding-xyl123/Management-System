import express from "express";
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registerationUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateUserInfo,
  updateProfileAvatar,
  getAllUsers,
  updateUsesrRole,
  deleteUser,
} from "../controllers/user.controller";
import { logout } from "@twilio/flex-ui/src/KeyboardShortcuts";
import { authorizeRoles, isAuthenticatd } from "../middleware/auth";
import { de } from "date-fns/locale";
const userRouter = express.Router();

userRouter.post("/registration", registerationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout", isAuthenticatd, authorizeRoles("admin"), logoutUser);

userRouter.get("/refresh", updateAccessToken);

userRouter.post("/me", isAuthenticatd, getUserInfo);

userRouter.post("/social-auth", socialAuth);

userRouter.put("/update-user-info", isAuthenticatd, updateUserInfo);

userRouter.put("/update-user-password", isAuthenticatd, updatePassword);

userRouter.put("/update-user-avatar", isAuthenticatd, updateProfileAvatar);

userRouter.get(
  "/get-user",
  isAuthenticatd,
  authorizeRoles("admin"),
  getAllUsers
);

userRouter.put(
  "/update-user",
  isAuthenticatd,
  authorizeRoles("admin"),
  updateUsesrRole
);

userRouter.delete("/delete-user/:id", isAuthenticatd, deleteUser);
export default userRouter;
