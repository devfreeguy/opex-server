import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TokenPayload, verifyToken } from "../utils/jwt.utils.js";
import { Role } from "../models/user.model.js";

// Extend Express request to hold `user`
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const validateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // Check Authorization header (Bearer <token>)
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    // If no token in header, check cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // Reject if no token found
    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Verify token
    const decodedToken = verifyToken(token) as JwtPayload | null;

    // console.log("Decoded Token:", decodedToken);

    if (decodedToken) {
      const payload = {
        uid: decodedToken.uid,
        role: decodedToken.role,
      };
      // console.log("Payload:", payload);

      // Attach payload to request object
      req.user = payload;
      return next();
    }

    return res
      .status(401)
      .json({ success: false, message: "Token verification failed" });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed", error });
  }
};

export const authorizeRoles = (...roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // console.log("User:", req.user);
    if (req.user && roles.includes(req.user.role)) return next();
    res.status(403).json({
      success: false,
      message:
        "Access denied, you do not have sufficient permission to continue with this request",
    });
  };
};