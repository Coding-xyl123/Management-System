import { Response } from "express";
import { IUser } from "../../models/user.model";
import { redis } from "./redis";
require("dotenv").config();

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none";
  secure?: boolean;
}
export const accessTokenExpires = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES || "300",
  10
);
const refreshTokenExpires = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES || "1200",
  10
);
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpires * 60 * 60 * 1000),
  maxAge: accessTokenExpires * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production" ? true : false,
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production" ? true : false,
};
export const sendToken = (
  user: IUser,
  statusCode: number,
  token: string,
  res: Response
) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();
  //uploade session to redis
  redis.set(user._id as string, JSON.stringify(user) as any);
  //parse enviroment variables to intergraate with redis

  //only
  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);
  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken,
  });
};
