import express from "express";
import login from "../controller/login.js";
import createUser from "../controller/create-user.js";
import validate from "../middleware/validate.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from '../middleware/authMiddleware.js';
import getUsers from "../controller/get-users.js";
import {
  createUserValidation,
  loginUser,
} from "../validations/userValidation.js";

const router = express.Router();

router.get("/login", validate(loginUser), login);
router.post(
  "/create-user",
  validate(createUserValidation),
  authMiddleware,
  roleMiddleware("Admin"),
  createUser,
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Security"),
  getUsers
);

export default router;
