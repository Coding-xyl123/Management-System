import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
require("dotenv").config();
const app = express();
import { Request, Response, NextFunction } from "express";
import { ErrorMiddleware } from "../middleware/error";
import courseRouter from "../routes/course.route";
import userRouter from "../routes/user.route";
import orderRouter from "../routes/order.route";
import notificationRouter from "../routes/notification.route";
import analyticsRouter from "../routes/analytics.route";
import layoutRouter from "../routes/layout.route";
// ... other imports

//body parser (should be before other middleware)
app.use(express.json({ limit: "50mb" }));
//cookie parsers
app.use(cookieParser());

//cors cross origin sharing (check process.env.ORIGIN!)
console.log("ORIGIN:", process.env.ORIGIN); //debugging line
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true, // <-- Enable credentials if using cookies
  })
);

//routes (consider organizing these better)
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

//test route
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "API is running" });
});

//unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error(`Resource not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
