import userModel from "../models/user.model";
import { redis } from "../src/utils/redis";
import { Response } from "express";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

//Get all users
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    users,
  });
};

//update user role
export const updateUsesrRoleService = async (
  id: string,
  role: string,
  res: Response
) => {
  const user = await userModel.findById(id, { role }, { new: true });
  res.status(201).json({
    success: true,
    user,
  });
};
