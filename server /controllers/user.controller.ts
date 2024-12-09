import e, { Request, Response, NextFunction } from "express";

import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../src/utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
require("dotenv").config();
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../src/utils/sendMail";
import { Interface } from "readline";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../src/utils/jwt";
import { red } from "@mui/material/colors";
import { redis } from "../src/utils/redis";
import {
  getAllUsersService,
  getUserById,
  updateUsesrRoleService,
} from "../services/user.service";
import { ca } from "date-fns/locale";
import cloudinary from "cloudinary";

//register user => /api/v1/register
interface IRegisterationBody {
  name: string;
  email: string;
  password: string;
  // avatar?: string;
}
interface IActivtionToken {
  token: string;
  //expiresIn: Date;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivtionToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.JWT_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );
  return { token, activationCode };
};

export const registerationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, avatar } = req.body;
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      const user: IRegisterationBody = {
        name,
        email,
        password,
        //avatar,
      };
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name, email, avatar }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );
      try {
        await sendMail({
          email,
          subject: "Account Activation",
          template: "activation-mail.ejs",
          data: { user: { name: user.name, email, avatar }, activationCode },
        });
        res.status(201).json({
          success: true,
          message:
            "Account registered successfully. Please check your email for activation code.",
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//activate user account => /api/v1/activation
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}
export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.JWT_SECRET as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      const { name, email, password } = newUser.user;
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("User already exists", 400));
      }
      const user = await userModel.create({
        name,
        email,
        password,
        //avatar,
      });
      res.status(201).json({
        success: true,
        message: "Account activated successfully.",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
interface ILoginBody {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginBody;
      if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400));
      }
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      const isPasswordMatched = await user.comparePassword(password);

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      // const accessToken = user.SignAccessToken();
      // const refreshToken = user.SignRefreshToken();
      // res.status(200).json({
      //     success: true,
      //     accessToken,
      //     refreshToken
      // });
      sendToken(user, 200, "", res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//logout user => /api/v1/logout
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("accessToken", "", { maxAge: 1 });
      res.cookie("refreshToken", "", { maxAge: 1 });
      const userId = req.user?._id || "";
      redis.del(userId);
      res.status(200).json({
        success: true,
        message: "Logged out",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update access token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken as string;
      if (!refreshToken) {
        return next(
          new ErrorHandler("Please login to access this resource", 400)
        );
      }
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;
      const message = "Could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler("refresh token is not valid", 400));
      }
      const session = await redis.get(decoded.id);
      if (!session) {
        return next(new ErrorHandler("User not found", 404));
      }
      const user = JSON.parse(session);
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );
      const newRefreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );
      req.user = user;

      res.cookie("accessToken", accessToken, accessTokenOptions);
      res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);
      await redis.set(user._id, JSON.stringify(user), "EX", 604800); //7 days
      res.status(200).json({
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
      });
      sendToken(JSON.parse(user), 200, "", res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get user info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

//social auth
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({
          name,
          email,
          avatar,
        });
        sendToken(newUser, 200, "", res);
      } else {
        sendToken(user, 200, "", res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user informatio
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;
      const user = await userModel.findById(userId);
      if (email && user) {
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
          return next(new ErrorHandler("Email already exists", 400));
        }
        user.email = email;
      }
      if (name && user) {
        user.name = name;
      }

      await user!.save();
      await redis.set(userId, JSON.stringify(user));
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;
      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }
      const user = await userModel.findById(req.user?._id).select("+password");
      if (user?.password === undefined) {
        return next(new ErrorHandler("User not found", 404));
      }
      const isPasswordMatched = await user?.comparePassword(oldPassword);
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
      }
      user.password = newPassword;
      await user.save();

      await redis.set(req.user?._id, JSON.stringify(user));
      res.status(200).json({
        sucess: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUpdateAvatar {
  avatar: string;
}
//update profile avatar
export const updateProfileAvatar = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateAvatar;
      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      if (avatar && user) {
        //check if user has an avatar
        if (user?.avatar?.public_id) {
          //delete previous avatar
          await cloudinary.v2.uploader.destroy(user.avatar?.public_id);
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            // crop: "scale",
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            // crop: "scale",
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }
      await user!.save();
      await redis.set(userId, JSON.stringify(user));
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//update user role'

export const updateUsesrRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;
      updateUsesrRoleService(id, role, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//delete user
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await userModel.findById;
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      await userModel.deleteOne({ _id: id });
      await redis.del(id);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
