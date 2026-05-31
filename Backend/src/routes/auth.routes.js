import express from "express";
import login from "../controller/login.js";
import validate from "../middleware/validate.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createUserValidation,
  loginUser,
} from "../validations/userValidation.js";

const router = express.Router();

router.post("/login", validate(loginUser), login);

export default router;
