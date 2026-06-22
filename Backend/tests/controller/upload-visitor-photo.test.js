import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockFindById = jest.fn();
jest.unstable_mockModule("../../src/models/Visitor.js", () => ({
  default: { findById: mockFindById },
}));

const { default: uploadVisitorPhoto } = await import(
  "../../src/controller/upload-visitor-photo.js"
);

describe("uploadVisitorPhoto controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "visitor-id" },
      file: { filename: "photo-123.jpg" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("should return 400 if id is not provided", async () => {
    req.params = { id: "" };

    await uploadVisitorPhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "id required",
    });
  });

  it("should return 404 if visitor is not found", async () => {
    mockFindById.mockResolvedValue(null);

    await uploadVisitorPhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Visitor not found",
    });
  });

  it("should return 400 if no file is uploaded", async () => {
    req.file = undefined;
    const visitor = { save: jest.fn() };
    mockFindById.mockResolvedValue(visitor);

    await uploadVisitorPhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "No file uploaded",
    });
  });

  it("should upload photo successfully", async () => {
    const visitor = {
      photo: null,
      save: jest.fn().mockResolvedValue(true),
    };
    mockFindById.mockResolvedValue(visitor);

    await uploadVisitorPhoto(req, res);

    expect(visitor.photo).toBe("photo-123.jpg");
    expect(visitor.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Photo uploaded successfully",
      data: visitor,
    });
  });

  it("should return 500 on unexpected error", async () => {
    mockFindById.mockRejectedValue(new Error("DB error"));

    await uploadVisitorPhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error while updating visitor photo",
    });
  });
});
