import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockCountDocuments = jest.fn();
jest.unstable_mockModule("../../src/models/Visitor.js", () => ({
  default: { countDocuments: mockCountDocuments },
}));

const mockCreateVisitorAccount = jest.fn();
jest.unstable_mockModule("../../src/processor/create-visitor.js", () => ({
  default: mockCreateVisitorAccount,
}));

const { default: createVisitor } = await import(
  "../../src/controller/create-visitor.js"
);

describe("createVisitor controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        visitorName: "Jane Doe",
        mobileNumber: "9876543210",
        contactPerson: "contact-id",
        purpose: "Meeting",
        noOfPersons: 2,
        vehicleNumber: "MH01AB1234",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("should create a visitor successfully", async () => {
    mockCountDocuments.mockResolvedValue(5);
    const createdVisitor = {
      _id: "visitor-id",
      visitorNo: "VN106",
      visitorName: "Jane Doe",
    };
    mockCreateVisitorAccount.mockResolvedValue(createdVisitor);

    await createVisitor(req, res);

    expect(mockCountDocuments).toHaveBeenCalled();
    expect(mockCreateVisitorAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        visitorNo: "VN106",
        visitorName: "Jane Doe",
        mobileNumber: "9876543210",
        contactPerson: "contact-id",
        purpose: "Meeting",
        noOfPersons: 2,
        vehicleNumber: "MH01AB1234",
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: createdVisitor,
    });
  });

  it("should generate correct visitor number based on count", async () => {
    mockCountDocuments.mockResolvedValue(0);
    mockCreateVisitorAccount.mockResolvedValue({});

    await createVisitor(req, res);

    expect(mockCreateVisitorAccount).toHaveBeenCalledWith(
      expect.objectContaining({ visitorNo: "VN101" })
    );
  });

  it("should include visitInTime in the visitor data", async () => {
    mockCountDocuments.mockResolvedValue(0);
    mockCreateVisitorAccount.mockResolvedValue({});

    await createVisitor(req, res);

    const callArg = mockCreateVisitorAccount.mock.calls[0][0];
    expect(callArg.visitInTime).toBeInstanceOf(Date);
  });

  it("should return 500 on unexpected error", async () => {
    mockCountDocuments.mockRejectedValue(new Error("DB error"));

    await createVisitor(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error while adding visitor",
    });
  });
});
