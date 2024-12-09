import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../src/utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
// import { type } from "os";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";
import { type } from "os";
import { ca } from "date-fns/locale";

//create layout
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { trype } = req.body;
      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        return next(new ErrorHandler("Layout already exist", 400));
      }
      if (trype === "Banner") {
        const { image, title, subtitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "banner",

          //  crop: "scale",
        });
        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subtitle,
        };
        await LayoutModel.create({ banner });
      }
      if (trype === "FAQ") {
        const { faq } = req.body;
        const FaqItem = await Promise.all(
          faq.map(async (item: any) => {
            return { question: item.question, answer: item.answer };
          })
        );
        await LayoutModel.create({ type: "FAQ", faq: FaqItem });
      }
      if (trype === "Category") {
        const { categories } = req.body;
        const Category = await Promise.all(
          categories.map(async (item: any) => {
            return { title: item.title };
          })
        );
        await LayoutModel.create({ type: "Category", categories: Category });
      }

      res.status(200).json({
        success: true,
        message: "create layout",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//edit layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const layout = await LayoutModel.findOne{ type };
      const { type } = req.body;
      const isTypeExist = await LayoutModel.findOne({ type });
      // if (isTypeExist) {
      //     return next(new ErrorHandler("Layout already exist", 400));
      //   }
      if (type === "Banner") {
        const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
        const { image, title, subtitle } = req.body;
        //await cloudinary.v2.uploader.destroy(image);
        if (bannerData) {
          await cloudinary.v2.uploader.destroy(
            bannerData.banner.image.public_id
          );
        }
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          type: "Banner",
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subtitle,
        };
        await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
      }
      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItem = await LayoutModel.findOne({ type: "FAQ" });
        const FaqItem = await Promise.all(
          faq.map(async (item: any) => {
            return { question: item.question, answer: item.answer };
          })
        );
        await LayoutModel.findByIdAndUpdate(FaqItem?.indexOf, {
          type: "FAQ",
          faq: FaqItem,
        });
      }
      if (type === "Category") {
        const { categories } = req.body;
        const CategoriesData = await LayoutModel.findOne({ type: "Category" });
        const categoriesItem = await Promise.all(
          categories.map(async (item: any) => {
            return { title: item.title };
          })
        );

        await LayoutModel.findByIdAndUpdate(CategoriesData?._id, {
          type: "Category",
          Categories: categoriesItem,
        });
      }

      res.status(200).json({
        success: true,
        message: "edit layout",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get layout by type
export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const layout = await LayoutModel.findOne({ type });
      res.status(200).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
