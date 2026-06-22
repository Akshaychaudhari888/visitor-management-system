import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";

const updateMeetingStatus = asyncHandler(async (req, res) => {
  const visitor = req.visitor;
  const { meetingStatus, meetingOutTime } = req.body;

  visitor.meetingStatus = meetingStatus;

  if (meetingOutTime) {
    visitor.meetingOutTime = meetingOutTime;
  }

  await visitor.save();

  return successResponse(res, visitor);
});

export default updateMeetingStatus;
