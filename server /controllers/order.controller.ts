import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../src/utils/ErrorHandler";
import orderModel, { IOrder } from "../models/orderModel";
import useModel from "../models/user.model";
import { redis } from "../src/utils/redis";
import courseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import fs from "fs";
import sendMail from "../src/utils/sendMail";
import NotificationModel from "../models/notificationModel";
import { ca, da } from "date-fns/locale";
import { getAllOrdersService, newOrdedr } from "../services/order.service";

//create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      const user = await useModel.findById(req.user?.id);
      const courseExistInUser = user?.coursers.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already enrolled in this course", 400)
        );
      }
      const course = await courseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      const data: any = {
        courseId: course._id,
        userId: req.user?.id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: (course._id as string).slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler("Email could not be sent", 500));
      }
      user?.coursers.push(course.id);
      await user?.save();
      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have successfully enrolled in ${course.name}`,
      });
      course.purchased ? (course.purchased += 1) : course.purchased;
      await course.save();
      newOrdedr(data, res, next);
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);
export const getAllOrders = async (
  res: Response,
  req: Request,
  next: NextFunction
) => {
  try {
    getAllOrdersService(res);
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};
