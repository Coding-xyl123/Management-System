import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../src/utils/ErrorHandler";
import mongoose, { Error } from "mongoose";
import cloudinary from "cloudinary";
import { creatCourse, getAllCoursesService } from "../services/course.service";
import courseModel from "../models/course.model";
import { redis } from "../src/utils/redis";
import ejs from "ejs";
import path from "path";
import sendMail from "../src/utils/sendMail";
import { title } from "process";
import NotificationModel from "../models/notificationModel";
import { getAllUsersService } from "../services/user.service";

export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "course",
          //  width: 150,
          //   crop: "scale",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      creatCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//edit course
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(data.thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "course",
          //  width: 150,
          //   crop: "scale",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
        const courseId = req.params.id;
        const course = await courseModel.findByIdAndUpdate(
          courseId,
          {
            $set: data,
          },
          { new: true }
        );
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get single course
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const isCacheExist = await redis.get(courseId);
      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await courseModel
          .findById(req.params.id)
          .select(
            "_courseData.videoUrl -courseData.suggestion -courseData.questions courseData.links"
          );
        await redis.set(courseId, JSON.stringify(course), "EX", 604776);
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get all courses
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("courses");
      if (isCacheExist) {
        const courses = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const courses = await courseModel
          .find()
          .select(
            "_courseData.videoUrl -courseData.suggestion -courseData.questions courseData.links"
          );
        await redis.set("courses", JSON.stringify(courses));
        res.status(200).json({
          success: true,
          courses,
        });
      }
      const courses = await courseModel
        .find()
        .select(
          "_courseData.videoUrl -courseData.suggestion -courseData.questions courseData.links"
        );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get Course content -- only for validate user
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courseList;
      const courseId = req.params.id;

      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not enrolled in this course", 400)
        );
      }
      const course = await courseModel.findById(courseId);
      const content = course?.courseData;
      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add questions in course

interface IQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IQuestionData = req.body;
      const course = await courseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      //create question
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };
      //add this question to course content
      courseContent.questions.push(newQuestion);

      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Received",
        message: `${req.user?.name} has asked a question in ${courseContent.title}`,
      });
      //save course
      await course?.save();
      res.status(200).json({
        success: true,
        message: "Question added successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add answer in course question
interface IAnswerData {
  questionId: string;
  answer: string;
  courseId: string;
  contentId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questionId, answer, courseId, contentId }: IAnswerData = req.body;
      const course = await courseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }
      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandler("Invalid question id", 400));
      }
      //create answer
      const newAnswer: any = {
        user: req.user,
        answer,
      };
      //add this answer to question
      question.questionReply.push(newAnswer);

      //save course
      await course?.save();
      if (req.user?._id === question.user._id) {
        //create notification
        await NotificationModel.create({
          user: req.user?._id,
          title: "Question Answered",
          message: `${req.user?.name} has answered a question in ${courseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );
        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add review in course
interface IReviewData {
  courseId: string;
  rating: number;
  review: string;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;
      //check if user is enrolled in this course
      const courseExists = userCourseList?.some(
        (course: any) => course._id.toString() === courseId.toString()
      );
      if (!courseExists) {
        return next(
          new ErrorHandler("You are not enrolled in this course", 400)
        );
      }
      const course = await courseModel.findById(courseId);
      const { rating, review }: IReviewData = req.body;
      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };
      course?.reviews.push(reviewData);
      let avg = 0;
      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });
      if (course && course.reviews.length > 0) {
        course.ratings = avg / course.reviews.length;
      }
      await course?.save();
      const notification = {
        title: "New Review",
        message: `${req.user?.name} has added a review in ${course?.name}`,
      };

      //create notification
      res.status(200).json({
        success: true,
        message: "Review added successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
interface IAddReviewData {
  courseId: string;
  comment: string;
  reviewId: string;
}
//add reply in review
export const addReply = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewData;
      const course = await courseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );
      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }

      const replyData: any = {
        user: req.user,
        comment,
      };
      if (!review.commentReply) {
        review.commentReply = [];
      }
      review.commentReply.push(replyData);
      await course.save();
      res.status(200).json({
        success: true,
        message: "Reply added successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//Delete course
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const course = await courseModel.findById;
      if (!course) {
        return next(new ErrorHandler("User not found", 404));
      }
      await courseModel.findByIdAndDelete(id);
      await redis.del("courses");

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
