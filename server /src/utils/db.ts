import mongoose from "mongoose";
require("dotenv").config();

const dbUrl: string = process.env.MONGO_URI || "";
const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(`MongoDB connected: ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error.message);
    process.exit(1);
  }
};
export default connectDB;
