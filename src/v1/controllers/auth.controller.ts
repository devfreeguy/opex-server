// src/v1/controllers/admin/auth.controller.ts
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model.js";
import { generateToken } from "../utils/jwt.utils.js";
import ApiResponse from "../classes/api.res.js";
import { compareHashedValue, hashValue } from "../utils/bcrypt.utils.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return ApiResponse.error(
        res,
        "All required fields must be provided",
        400
      );
    }

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return ApiResponse.error(res, "User already exists", 409);
    }

    const hashedPassword = await hashValue(password);
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "buyer",
    });

    return ApiResponse.success(res, user, "Admin created successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, "Email and password are required", 400);
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return ApiResponse.error(res, "User not found", 404);
    }

    const isMatch = await compareHashedValue(password, user.passwordHash);
    if (!isMatch) {
      return ApiResponse.error(res, "Invalid credentials", 401);
    }

    const token = await generateToken({
      userId: user._id,
      role: user.role,
    });

    return ApiResponse.sendToken(
      res,
      token,
      user,
      `Welcome back, ${user.firstName}`
    );
  } catch (err) {
    next(err);
  }
};
