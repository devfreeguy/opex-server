import jwt, { SignOptions } from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET } from "../config/config.js";
import { Role } from "../models/user.model.js";

export interface TokenPayload {
  userId: any;
  role: Role;
}

async function generateToken(payload: TokenPayload): Promise<string> {
  const tokenPayload: TokenPayload = {
    userId: payload.userId,
    role: payload.role,
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRATION as any, // Default to 2 days if not set,
  };

  return jwt.sign(tokenPayload, JWT_SECRET, options);
}

function verifyToken(
  token: string
): { userId: string; role: string } | object | string | undefined {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export { generateToken, verifyToken };
