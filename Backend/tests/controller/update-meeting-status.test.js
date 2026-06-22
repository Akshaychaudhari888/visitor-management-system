import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockFindById = jest.fn();
jest.unstable_mockModule("../../src/models/Visitor.js", () => ({
  default: { findById: mockFindById },
}));

const { default: updateMeetingStatus } = await import(
  "../../src/controller/update-meeting-status.js"
);

describe("updateMeetingStatus controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "visitor-id" },
      body: { meetingStatus: "Completed" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("should return 400 if id is not provided", async () => {
    req.params = { id: "" };

    await updateMeetingStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "id required",
    });
  });

  it("should return 404 if visitor is not found", async () => {
    mockFindById.mockResolvedValue(null);

    await updateMeetingStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Visitor not found",
    });
  });

  it("should update meeting status successfully", async () => {
    const visitor = {
      meetingStatus: "Pending",
      save: jest.fn().mockResolvedValue(true),
    };
    mockFindById.mockResolvedValue(visitor);

    await updateMeetingStatus(req, res);

    expect(visitor.meetingStatus).toBe("Completed");
    expect(visitor.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Meeting status updated successfully",
      data: visitor,
    });
  });

  it("should set meetingOutTime if provided", async () => {
    const meetingOutTime = "2024-01-01T10:00:00Z";
    req.body = { meetingStatus: "Completed", meetingOutTime };
    const visitor = {
      meetingStatus: "Pending",
      save: jest.fn().mockResolvedValue(true),
    };
    mockFindById.mockResolvedValue(visitor);

    await updateMeetingStatus(req, res);

    expect(visitor.meetingOutTime).toBe(meetingOutTime);
  });

  it("should not set meetingOutTime if not provided", async () => {
    const visitor = {
      meetingStatus: "Pending",
      save: jest.fn().mockResolvedValue(true),
    };
    mockFindById.mockResolvedValue(visitor);

    await updateMeetingStatus(req, res);

    expect(visitor.meetingOutTime).toBeUndefined();
  });

  it("should return 500 on unexpected error", async () => {
    mockFindById.mockRejectedValue(new Error("DB error"));

    await updateMeetingStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error while update meeting status",
    });
  });
});
