import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";

const visitorOut = asyncHandler(async (req, res) => {
  const visitor = req.visitor;

  const visitorOutTime = new Date();
  const totalMinutes = Math.floor(
    (visitorOutTime - visitor.visitInTime) / (1000 * 60)
  );

  visitor.visitorOutTime = visitorOutTime;
  visitor.totalTimeSpent = `${totalMinutes} minutes`;

  await visitor.save();

  return successResponse(res, visitor);
});

export default visitorOut;
