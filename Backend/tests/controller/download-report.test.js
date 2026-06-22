import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockPopulate = jest.fn();
const mockFind = jest.fn().mockReturnValue({ populate: mockPopulate });

jest.unstable_mockModule("../../src/models/Visitor.js", () => ({
  default: { find: mockFind },
}));

const mockWrite = jest.fn();
const mockAddRow = jest.fn();
const mockAddWorksheet = jest.fn().mockReturnValue({
  columns: [],
  addRow: mockAddRow,
});

jest.unstable_mockModule("exceljs", () => {
  return {
    default: {
      Workbook: class {
        constructor() {
          this.addWorksheet = mockAddWorksheet;
          this.xlsx = { write: mockWrite };
        }
      },
    },
  };
});

const { default: downloadReport } = await import(
  "../../src/controller/download-report.js"
);

describe("downloadReport controller", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      end: jest.fn(),
    };
    jest.clearAllMocks();
    mockFind.mockReturnValue({ populate: mockPopulate });
  });

  it("should fetch visitors with populated contactPerson", async () => {
    mockPopulate.mockResolvedValue([]);
    mockWrite.mockResolvedValue(undefined);

    await downloadReport(req, res);

    expect(mockFind).toHaveBeenCalled();
    expect(mockPopulate).toHaveBeenCalledWith(
      "contactPerson",
      "name phone role"
    );
  });

  it("should set correct response headers for xlsx download", async () => {
    mockPopulate.mockResolvedValue([]);
    mockWrite.mockResolvedValue(undefined);

    await downloadReport(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Disposition",
      "attachment; filename=visitors-report.xlsx"
    );
  });

  it("should add rows for each visitor", async () => {
    const visitors = [
      {
        visitorNo: "VN101",
        visitorName: "John",
        mobileNumber: "1234567890",
        purpose: "Meeting",
        contactPerson: { name: "HR Person" },
        visitInTime: new Date(),
        visitorOutTime: new Date(),
        totalTimeSpent: "30 minutes",
        meetingStatus: "Completed",
      },
    ];
    mockPopulate.mockResolvedValue(visitors);
    mockWrite.mockResolvedValue(undefined);

    await downloadReport(req, res);

    expect(mockAddRow).toHaveBeenCalledWith(
      expect.objectContaining({
        visitorNo: "VN101",
        visitorName: "John",
        contactPerson: "HR Person",
      })
    );
  });

  it("should call res.end() after writing", async () => {
    mockPopulate.mockResolvedValue([]);
    mockWrite.mockResolvedValue(undefined);

    await downloadReport(req, res);

    expect(res.end).toHaveBeenCalled();
  });

  it("should return 500 on error", async () => {
    mockPopulate.mockRejectedValue(new Error("DB error"));

    await downloadReport(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error while downloading report",
    });
  });
});
