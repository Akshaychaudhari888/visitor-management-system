import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockHash = jest.fn();
jest.unstable_mockModule("bcryptjs", () => ({
  default: { hash: mockHash },
}));

const mockGetUserDetails = jest.fn();
jest.unstable_mockModule("../../src/processor/get-user-details.js", () => ({
  default: mockGetUserDetails,
}));

const mockCreateUserAccount = jest.fn();
jest.unstable_mockModule("../../src/processor/create-user.js", () => ({
  default: mockCreateUserAccount,
}));

const { default: createUser } = await import(
  "../../src/controller/create-user.js"
);

describe("createUser controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        userName: "John Doe",
        password: "password123",
        phone: "1234567890",
        role: "Admin",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("should return 400 if user already exists", async () => {
    mockGetUserDetails.mockResolvedValue({ _id: "existing-id" });

    await createUser(req, res);

    expect(mockGetUserDetails).toHaveBeenCalledWith({
      findBy: { phone: "1234567890" },
      projection: { _id: 1 },
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User already exists",
    });
  });

  it("should create user successfully when user does not exist", async () => {
    mockGetUserDetails.mockResolvedValue(null);
    mockHash.mockResolvedValue("hashed-password");
    const createdUser = {
      _id: "new-id",
      userName: "John Doe",
      phone: "1234567890",
      role: "Admin",
    };
    mockCreateUserAccount.mockResolvedValue(createdUser);

    await createUser(req, res);

    expect(mockHash).toHaveBeenCalledWith("password123", 10);
    expect(mockCreateUserAccount).toHaveBeenCalledWith({
      data: {
        userName: "John Doe",
        phone: "1234567890",
        password: "hashed-password",
        role: "Admin",
      },
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: createdUser,
    });
  });

  it("should return 500 on unexpected error", async () => {
    mockGetUserDetails.mockRejectedValue(new Error("DB error"));

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error while creating user",
    });
  });
});
