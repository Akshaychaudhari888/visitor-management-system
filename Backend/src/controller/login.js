import getUserDetails from "../processor/get-user-details.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import { errorResponse } from "../utils/response.js";

const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await getUserDetails({ findBy: { phone } });

  if (!user) {
    return errorResponse(res, "Invalid username or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return errorResponse(res, "Invalid username or password", 401);
  }

  const token = generateToken({
    userId: user._id,
    role: user.role,
  });

  return res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  });
});

export default login;
