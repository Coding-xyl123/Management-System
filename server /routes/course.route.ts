import express from "express";
const courseRouter = express.Router();
import {
  addAnswer,
  addQuestion,
  addReview,
  addReply,
  editCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
  deleteCourse,
} from "../controllers/course.controller";
import { authorizeRoles, isAuthenticatd } from "../middleware/auth";
import exp from "constants";
import { get } from "http";
import { add } from "date-fns";

courseRouter.post(
  "/create-course",
  isAuthenticatd,
  authorizeRoles("admin"),
  uploadCourse
);
courseRouter.put(
  "/edit-course/:id",
  isAuthenticatd,
  authorizeRoles("admin"),
  uploadCourse
);
courseRouter.get("/get-course", getAllCourses);
courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-course-content/:id", isAuthenticatd, getCourseByUser);
courseRouter.put("/add-question", isAuthenticatd, addQuestion);
courseRouter.put("/add-answer", isAuthenticatd, addAnswer);
courseRouter.put("/add-review/:id", isAuthenticatd, addReview);
courseRouter.put(
  "/add-reply/:id",
  isAuthenticatd,
  authorizeRoles("admin"),
  addReply
);
courseRouter.put(
  "/get-courses",
  isAuthenticatd,
  authorizeRoles("admin"),
  getAllCourses
);
courseRouter.delete(
  "/delete-course/:id",
  isAuthenticatd,
  authorizeRoles("admin"),
  deleteCourse
);
export default courseRouter;
