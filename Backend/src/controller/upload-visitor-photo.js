import asyncHandler from "../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

const uploadVisitorPhoto = asyncHandler(async (req, res) => {
  const visitor = req.visitor;

  if (!req.file) {
    return errorResponse(res, "No file uploaded", 400);
  }

  visitor.photo = req.file.filename;

  await visitor.save();

  return successResponse(res, visitor);
});

export default uploadVisitorPhoto;
