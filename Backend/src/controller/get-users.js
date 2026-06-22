import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find(
    { role: { $in: ["HR", "Manager"] } },
    { password: 0 }
  );

  return successResponse(res, users);
});

export default getUsers;
