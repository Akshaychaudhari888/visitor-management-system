import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    visitorNo: {
      type: String,
      unique: true,
      required: true,
    },
    visitorName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    noOfPersons: {
      type: Number,
      default: 1,
    },
    vehicleNumber: String,

    visitInTime: {
      type: Date,
      default: Date.now,
    },

    visitorOutTime: Date,

    totalTimeSpent: String,

    meetingStatus: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },

    photo: {
      type: String
    },

    meetingOutTime: Date,
  },
  {
    timestamps: true,
  }
);
const visitor = new mongoose.model("Visitor", visitorSchema);

export default visitor;