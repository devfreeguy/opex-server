import { NextFunction, Request, Response } from "express";
import Logging from "../config/logging.js";
import ApiResponse from "../classes/api.res.js";

export interface IError extends Error {
  status?: number; // Status code
}

export const errorMiddleware = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    Logging.error(err);
    ApiResponse.error(res);
  } catch (error) {
    next(error);
  }
};
