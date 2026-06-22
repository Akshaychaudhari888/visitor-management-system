import express from "express";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import findVisitorById from "../middleware/findVisitorById.js";
import upload from "../middleware/uploadMiddleware.js";
import createVisitor from "../controller/create-visitor.js";
import getVisitors from "../controller/get-visitors.js";
import visitorOut from "../controller/visitor-out.js";
import updateMeetingStatus from "../controller/update-meeting-status.js";
import uploadVisitorPhoto from "../controller/upload-visitor-photo.js";
import downloadReport from "../controller/download-report.js";

const router = express.Router();

router.post(
  "/create-visitor",
  authMiddleware,
  roleMiddleware("Security"),
  createVisitor
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Security", "Manager", "HR"),
  getVisitors
);

router.patch(
  "/out/:id",
  authMiddleware,
  roleMiddleware("Security", "Manager", "HR"),
  findVisitorById,
  visitorOut
);

router.patch(
  "/meeting/:id",
  authMiddleware,
  roleMiddleware("Manager", "HR"),
  findVisitorById,
  updateMeetingStatus
);

router.patch(
  "/photo/:id",
  authMiddleware,
  roleMiddleware("Security"),
  findVisitorById,
  upload.single("photo"),
  uploadVisitorPhoto
);

router.get(
  "/report",
  authMiddleware,
  roleMiddleware("Security", "Admin"),
  downloadReport
);

export default router;
