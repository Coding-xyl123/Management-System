import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../src/utils/ErrorHandler";
import { CatchAsyncError } from "./catchAsyncErrors";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { red } from "@mui/material/colors";
import { redis } from "../src/utils/redis";
import { JwtPayload } from "jsonwebtoken";
//authenticating user
export const isAuthenticatd = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.accessToken;
    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }
    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("access token is not valid", 400));
    }

    const user = await redis.get(decoded.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    req.user = JSON.parse(user);
    next();
  }
);

//validate user roles
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role || "")) {
      return next(
        new ErrorHandler(
          `Role (${req.user?.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
