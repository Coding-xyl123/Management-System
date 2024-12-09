import { NextFunction, Response } from "express";
import courseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { de } from "date-fns/locale";
import { getAllUsersService } from "./user.service";
import ErrorHandler from "../src/utils/ErrorHandler";

export const creatCourse = async (data: any, res: Response, next: unknown) => {
  const course = await courseModel.create(data);
  res.status(201).json({
    success: true,
    course,
  });
};

export const getAllCoursesService = async (
  data: any,
  res: Response,
  next: unknown
) => {
  const course = await courseModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    course,
  });
};
