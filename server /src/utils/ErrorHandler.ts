import e from "express";

class ErrorHandler extends Error {
  statusCode: Number;

  constructor(message: any, statusCode: Number) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorHandler;
export default ErrorHandler;
