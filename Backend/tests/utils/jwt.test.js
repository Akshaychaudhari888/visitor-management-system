import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import jwt from "jsonwebtoken";

describe("JWT Utils", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-jwt-secret";
  });

  describe("generateToken", () => {
    let generateToken;

    beforeEach(async () => {
      const module = await import("../../src/utils/jwt.js");
      generateToken = module.generateToken;
    });

    it("should generate a valid JWT token", () => {
      const payload = { userId: "123", role: "Admin" };
      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("should include the payload in the token", () => {
      const payload = { userId: "456", role: "Security" };
      const token = generateToken(payload);
      const decoded = jwt.verify(token, "test-jwt-secret");

      expect(decoded.userId).toBe("456");
      expect(decoded.role).toBe("Security");
    });

    it("should set expiration to 1 day", () => {
      const payload = { userId: "789", role: "Manager" };
      const token = generateToken(payload);
      const decoded = jwt.verify(token, "test-jwt-secret");

      const expectedExp = Math.floor(Date.now() / 1000) + 86400;
      expect(decoded.exp).toBeCloseTo(expectedExp, -1);
    });
  });

  describe("verifyToken", () => {
    let verifyToken, generateToken;

    beforeEach(async () => {
      const module = await import("../../src/utils/jwt.js");
      verifyToken = module.verifyToken;
      generateToken = module.generateToken;
    });

    it("should verify a valid token and return payload", () => {
      const payload = { userId: "123", role: "Admin" };
      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe("123");
      expect(decoded.role).toBe("Admin");
    });

    it("should throw for an invalid token", () => {
      expect(() => verifyToken("invalid.token.here")).toThrow();
    });

    it("should throw for a token signed with a different secret", () => {
      const token = jwt.sign({ userId: "123" }, "different-secret");
      expect(() => verifyToken(token)).toThrow();
    });
  });
});
