import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockFind = jest.fn();
const mockCountDocuments = jest.fn();
const mockSort = jest.fn();
const mockSkip = jest.fn();
const mockLimit = jest.fn();
const mockLean = jest.fn();

mockFind.mockReturnValue({ sort: mockSort });
mockSort.mockReturnValue({ skip: mockSkip });
mockSkip.mockReturnValue({ limit: mockLimit });
mockLimit.mockReturnValue({ lean: mockLean });

jest.unstable_mockModule("../../src/models/Visitor.js", () => ({
  default: {
    find: mockFind,
    countDocuments: mockCountDocuments,
  },
}));

const { default: getVisitors } = await import(
  "../../src/controller/get-visitors.js"
);

describe("getVisitors controller", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
    mockFind.mockReturnValue({ sort: mockSort });
    mockSort.mockReturnValue({ skip: mockSkip });
    mockSkip.mockReturnValue({ limit: mockLimit });
    mockLimit.mockReturnValue({ lean: mockLean });
  });

  it("should return visitors with default pagination", async () => {
    const visitors = [{ visitorNo: "VN101" }, { visitorNo: "VN102" }];
    mockLean.mockResolvedValue(visitors);
    mockCountDocuments.mockResolvedValue(2);

    await getVisitors(req, res);

    expect(mockSkip).toHaveBeenCalledWith(0);
    expect(mockLimit).toHaveBeenCalledWith(10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      page: 1,
      limit: 10,
      totalCount: 2,
      totalPages: 1,
      data: visitors,
    });
  });

  it("should respect page and limit query params", async () => {
    req.query = { page: "2", limit: "5" };
    mockLean.mockResolvedValue([]);
    mockCountDocuments.mockResolvedValue(15);

    await getVisitors(req, res);

    expect(mockSkip).toHaveBeenCalledWith(5);
    expect(mockLimit).toHaveBeenCalledWith(5);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
        limit: 5,
        totalCount: 15,
        totalPages: 3,
      })
    );
  });

  it("should sort by createdAt descending", async () => {
    mockLean.mockResolvedValue([]);
    mockCountDocuments.mockResolvedValue(0);

    await getVisitors(req, res);

    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it("should return 500 on error", async () => {
    mockFind.mockImplementation(() => {
      throw new Error("DB error");
    });

    await getVisitors(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error while getting visitor list",
    });
  });

  it("should calculate totalPages correctly", async () => {
    mockLean.mockResolvedValue([]);
    mockCountDocuments.mockResolvedValue(23);
    req.query = { page: "1", limit: "10" };

    await getVisitors(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ totalPages: 3 })
    );
  });
});
