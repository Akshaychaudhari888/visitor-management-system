import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockFindById = jest.fn();
jest.unstable_mockModule("../../src/models/Visitor.js", () => ({
  default: { findById: mockFindById },
}));

const { default: visitorOut } = await import(
  "../../src/controller/visitor-out.js"
);

describe("visitorOut controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "visitor-id" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("should return 400 if id is not provided", async () => {
    req.params = { id: "" };

    await visitorOut(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "id required",
    });
  });

  it("should return 404 if visitor is not found", async () => {
    mockFindById.mockResolvedValue(null);

    await visitorOut(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Visitor not found",
    });
  });

  it("should update visitor out time and calculate total time", async () => {
    const visitInTime = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    const visitor = {
      visitInTime,
      save: jest.fn().mockResolvedValue(true),
    };
    mockFindById.mockResolvedValue(visitor);

    await visitorOut(req, res);

    expect(visitor.visitorOutTime).toBeInstanceOf(Date);
    expect(visitor.totalTimeSpent).toMatch(/\d+ minutes/);
    expect(visitor.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Visitor exit updated successfully",
      data: visitor,
    });
  });

  it("should calculate total time correctly (60 min for 1 hour)", async () => {
    const visitInTime = new Date(Date.now() - 60 * 60 * 1000);
    const visitor = {
      visitInTime,
      save: jest.fn().mockResolvedValue(true),
    };
    mockFindById.mockResolvedValue(visitor);

    await visitorOut(req, res);

    const minutes = parseInt(visitor.totalTimeSpent);
    expect(minutes).toBeGreaterThanOrEqual(59);
    expect(minutes).toBeLessThanOrEqual(61);
  });

  it("should return 500 on unexpected error", async () => {
    mockFindById.mockRejectedValue(new Error("DB error"));

    await visitorOut(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "DB error",
    });
  });
});
