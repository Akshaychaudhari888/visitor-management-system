import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const { default: roleMiddleware } = await import(
  "../../src/middleware/roleMiddleware.js"
);

describe("roleMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it("should return 401 if req.user is not set", () => {
    const middleware = roleMiddleware("Admin");

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 if user role is not in allowed roles", () => {
    req.user = { role: "Security" };
    const middleware = roleMiddleware("Admin", "Manager");

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Access Denied",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() if user role is in allowed roles", () => {
    req.user = { role: "Admin" };
    const middleware = roleMiddleware("Admin", "Manager");

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should handle multiple allowed roles correctly", () => {
    req.user = { role: "HR" };
    const middleware = roleMiddleware("Admin", "Security", "Manager", "HR");

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should handle single allowed role", () => {
    req.user = { role: "Security" };
    const middleware = roleMiddleware("Security");

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should be case-sensitive for role comparison", () => {
    req.user = { role: "admin" };
    const middleware = roleMiddleware("Admin");

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
