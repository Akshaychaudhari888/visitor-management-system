import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock jsonwebtoken
const mockVerify = jest.fn();
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: { verify: mockVerify },
}));

const { default: auth } = await import(
  "../../src/middleware/authMiddleware.js"
);

describe("authMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("should return 401 if authorization header is missing", () => {
    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "Invalid token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    req.headers.authorization = "Bearer invalid-token";
    mockVerify.mockImplementation(() => {
      throw new Error("jwt malformed");
    });

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "Invalid token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should set req.user and call next() for a valid token", () => {
    const decoded = { userId: "123", role: "Admin" };
    req.headers.authorization = "Bearer valid-token";
    mockVerify.mockReturnValue(decoded);

    auth(req, res, next);

    expect(mockVerify).toHaveBeenCalledWith("valid-token", "test-secret");
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });

  it("should split token correctly from Bearer prefix", () => {
    const decoded = { userId: "456", role: "Security" };
    req.headers.authorization = "Bearer my.jwt.token";
    mockVerify.mockReturnValue(decoded);

    auth(req, res, next);

    expect(mockVerify).toHaveBeenCalledWith("my.jwt.token", "test-secret");
  });
});
