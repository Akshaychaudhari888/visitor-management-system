import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockCompare = jest.fn();
jest.unstable_mockModule("bcryptjs", () => ({
  default: { compare: mockCompare },
}));

const mockGetUserDetails = jest.fn();
jest.unstable_mockModule("../../src/processor/get-user-details.js", () => ({
  default: mockGetUserDetails,
}));

const mockGenerateToken = jest.fn();
jest.unstable_mockModule("../../src/utils/jwt.js", () => ({
  generateToken: mockGenerateToken,
}));

const { default: login } = await import("../../src/controller/login.js");

describe("login controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        phone: "1234567890",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("should return 401 if user is not found", async () => {
    mockGetUserDetails.mockResolvedValue(null);

    await login(req, res);

    expect(mockGetUserDetails).toHaveBeenCalledWith({
      findBy: { phone: "1234567890" },
    });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid username or password",
    });
  });

  it("should return 401 if password does not match", async () => {
    mockGetUserDetails.mockResolvedValue({
      _id: "user-id",
      password: "hashed-password",
      role: "Admin",
    });
    mockCompare.mockResolvedValue(false);

    await login(req, res);

    expect(mockCompare).toHaveBeenCalledWith("password123", "hashed-password");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid username or password",
    });
  });

  it("should return 200 with token on successful login", async () => {
    const user = {
      _id: "user-id",
      username: "John",
      password: "hashed-password",
      role: "Admin",
    };
    mockGetUserDetails.mockResolvedValue(user);
    mockCompare.mockResolvedValue(true);
    mockGenerateToken.mockReturnValue("jwt-token");

    await login(req, res);

    expect(mockGenerateToken).toHaveBeenCalledWith({
      userId: "user-id",
      role: "Admin",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: "jwt-token",
      user: {
        id: "user-id",
        username: "John",
        role: "Admin",
      },
    });
  });

  it("should return 500 on unexpected error", async () => {
    mockGetUserDetails.mockRejectedValue(new Error("DB error"));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error while login",
    });
  });
});
