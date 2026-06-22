import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const { default: validate } = await import(
  "../../src/middleware/validate.js"
);

describe("validate middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it("should call next() when validation passes", () => {
    const schema = {
      validate: jest.fn().mockReturnValue({ error: null }),
    };

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(schema.validate).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 400 with error message when validation fails", () => {
    const schema = {
      validate: jest.fn().mockReturnValue({
        error: {
          details: [{ message: '"userName" is required' }],
        },
      }),
    };

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: '"userName" is required',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should pass req.body to schema.validate", () => {
    req.body = { userName: "test", phone: "1234567890" };
    const schema = {
      validate: jest.fn().mockReturnValue({ error: null }),
    };

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(schema.validate).toHaveBeenCalledWith({
      userName: "test",
      phone: "1234567890",
    });
  });

  it("should return first error message from details array", () => {
    const schema = {
      validate: jest.fn().mockReturnValue({
        error: {
          details: [
            { message: "first error" },
            { message: "second error" },
          ],
        },
      }),
    };

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "first error",
    });
  });
});
