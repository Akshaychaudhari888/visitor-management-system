import bcrypt from "bcryptjs";
import getUserDetails from "../processor/get-user-details.js";
import createUserAccount from "../processor/create-user.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

const createUser = asyncHandler(async (req, res) => {
  const { userName, password, phone, role } = req.body;

  const exitingUser = await getUserDetails({
    findBy: { phone },
    projection: { _id: 1 },
  });

  if (exitingUser) {
    return errorResponse(res, "User already exists", 400);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await createUserAccount({
    data: { userName, phone, password: hashPassword, role },
  });

  return successResponse(res, user, 201);
});

export default createUser;
