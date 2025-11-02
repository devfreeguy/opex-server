import { Response } from "express";

interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
}

class ApiResponse {
  /**
   * Send a success response
   * @param res - Express response object
   * @param data - Response data
   * @param message - Success message (default: "Operation successful")
   * @param statusCode - HTTP status code (default: 200)
   */
  static success<T>(
    res: Response,
    data: T,
    message: string = "Operation successful",
    statusCode: number = 200
  ): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  }

  /**
   * Send an error response
   * @param res - Express response object
   * @param message - Error message (default: "Something went wrong")
   * @param statusCode - HTTP status code (default: 500)
   * @param data - Optional error data (default: null)
   */
  static error<T = null>(
    res: Response,
    message: string = "Something went wrong",
    statusCode: number = 500,
    data: T | null = null
  ): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      success: false,
      data,
      message,
    });
  }

  /**
   * Generic send method for custom responses
   * @param res - Express response object
   * @param success - Success status
   * @param data - Response data
   * @param message - Response message
   * @param statusCode - HTTP status code (default: 200)
   */
  static send<T>(
    res: Response,
    success: boolean,
    data: T | null,
    message: string,
    statusCode: number = 200
  ): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      success,
      data,
      message,
    });
  }
  /**
   * Sends HTTP-only cookie with token and returns success response
   * @param res - Express response object
   * @param token - JWT token or any token string
   * @param data - Response data
   * @param message - Success message (default: "Authentication successful")
   * @param cookieOptions - Optional cookie configuration
   */
  static sendToken<T>(
    res: Response,
    token: string,
    data: T,
    message: string = "Authentication successful",
    cookieOptions?: {
      maxAge?: number;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "strict" | "lax" | "none";
      path?: string;
    }
  ): Response<ApiResponse<T>> {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 24 * 60 * 60 * 1000 * 3, // 24 hours * 3 (3 days)
      path: "/",
      ...cookieOptions,
    };

    res.cookie("token", token, defaultOptions);

    return res.status(200).json({
      success: true,
      data,
      message,
    });
  }
}

// Usage Examples:

// Success with default message and status
// ApiResponder.success(res, { id: 1, name: 'John' });

// Success with custom message
// ApiResponder.success(res, { id: 1, name: 'John' }, 'User created successfully', 201);

// Error with default message and status (500)
// ApiResponder.error(res);

// Error with custom message and status
// ApiResponder.error(res, 'User not found', 404);

// Error with additional data
// ApiResponder.error(res, 'Validation failed', 400, { errors: ['Email is required'] });

// Custom response using send method
// ApiResponder.send(res, true, { token: 'abc123' }, 'Login successful', 200);

export default ApiResponse;
