import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../src/utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { generateLast12MonthsData } from "../src/analytics.generator";
import userModel from "../models/user.model";
import orderModel from "../models/orderModel";
import courseModel from "../models/course.model";

//get users analytics -- admin
export const getUsersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthsData(userModel);
      res.status(200).json({
        success: true,
        message: "get users analytics",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//get courses analytics -- admin
export const getCoursesAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await generateLast12MonthsData(courseModel);
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getOrderAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await generateLast12MonthsData(orderModel);
      res.status(200).json({
        success: true,
        order,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
