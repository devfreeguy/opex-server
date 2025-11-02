import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";

const router = Router();

// Create a new buyers account
router.post("/register", register);

// Login to buyers account
router.post("/login", login);

export { router as authRoute };
