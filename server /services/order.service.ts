import mongoose from "mongoose";
import { Schema, Document, Model } from "mongoose";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { NextFunction, Response } from "express";
import orderModel from "../models/orderModel";

//create new order
export const newOrdedr = CatchAsyncError(
  async (data: any, next: NextFunction, res: Response) => {
    const order = await orderModel.create(data);
    res.status(201).json({
      success: true,
      order,
    });
  }
);

export const getAllOrdersService = async (res: Response) => {
  const orders = await orderModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    orders,
  });
};
