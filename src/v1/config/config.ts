import { config } from "dotenv";
import { envValidation } from "../validations/index.js";
import logger from "./logging.js";
import { Secret } from "jsonwebtoken";
config();

const { value: envVars, error } = envValidation.validate(process.env);
if (error) logger.error(error);
export const PORT: number = parseInt(envVars.PORT);
export const NODE_ENV: string = envVars.NODE_ENV;

// MongoDB
export const DB_CONNECTION: string = envVars.DB_CONNECTION;

// JWT
export const JWT_SECRET: Secret = envVars.JWT_SECRET ?? "secret";
export const JWT_EXPIRATION: string = envVars.JWT_EXPIRATION ?? "1d";
