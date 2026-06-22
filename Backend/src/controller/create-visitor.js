import Visitor from "../models/Visitor.js";
import createVisitorAccount from "../processor/create-visitor.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";

const createVisitor = asyncHandler(async (req, res) => {
  const {
    visitorName,
    mobileNumber,
    contactPerson,
    purpose,
    noOfPersons,
    vehicleNumber,
  } = req.body;

  const visitorCount = await Visitor.countDocuments();
  const visitorNo = `VN${101 + visitorCount}`;

  const visitor = await createVisitorAccount({
    visitorNo,
    visitorName,
    mobileNumber,
    contactPerson,
    purpose,
    noOfPersons,
    vehicleNumber,
    visitInTime: new Date(),
  });

  return successResponse(res, visitor, 201);
});

export default createVisitor;
