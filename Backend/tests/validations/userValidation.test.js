import { describe, it, expect } from "@jest/globals";
import {
  createUserValidation,
  loginUser,
} from "../../src/validations/userValidation.js";

describe("userValidation", () => {
  describe("createUserValidation", () => {
    it("should pass with valid data", () => {
      const { error } = createUserValidation.validate({
        userName: "John Doe",
        password: "password123",
        phone: "1234567890",
        role: "Admin",
      });
      expect(error).toBeUndefined();
    });

    it("should fail when userName is missing", () => {
      const { error } = createUserValidation.validate({
        password: "password123",
        phone: "1234567890",
        role: "Admin",
      });
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("userName");
    });

    it("should fail when userName is less than 3 characters", () => {
      const { error } = createUserValidation.validate({
        userName: "Jo",
        password: "password123",
        phone: "1234567890",
        role: "Admin",
      });
      expect(error).toBeDefined();
    });

    it("should fail when password is missing", () => {
      const { error } = createUserValidation.validate({
        userName: "John Doe",
        phone: "1234567890",
        role: "Admin",
      });
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("password");
    });

    it("should fail when password is less than 6 characters", () => {
      const { error } = createUserValidation.validate({
        userName: "John Doe",
        password: "pass",
        phone: "1234567890",
        role: "Admin",
      });
      expect(error).toBeDefined();
    });

    it("should fail when phone is missing", () => {
      const { error } = createUserValidation.validate({
        userName: "John Doe",
        password: "password123",
        role: "Admin",
      });
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("phone");
    });

    it("should fail when phone is less than 10 characters", () => {
      const { error } = createUserValidation.validate({
        userName: "John Doe",
        password: "password123",
        phone: "123456",
        role: "Admin",
      });
      expect(error).toBeDefined();
    });

    it("should fail when phone is more than 12 characters", () => {
      const { error } = createUserValidation.validate({
        userName: "John Doe",
        password: "password123",
        phone: "1234567890123",
        role: "Admin",
      });
      expect(error).toBeDefined();
    });

    it("should fail when role is missing", () => {
      const { error } = createUserValidation.validate({
        userName: "John Doe",
        password: "password123",
        phone: "1234567890",
      });
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("role");
    });

    it("should fail when role is not a valid enum value", () => {
      const { error } = createUserValidation.validate({
        userName: "John Doe",
        password: "password123",
        phone: "1234567890",
        role: "SuperAdmin",
      });
      expect(error).toBeDefined();
    });

    it("should accept all valid roles", () => {
      const roles = ["Admin", "HR", "Security", "Manager"];
      for (const role of roles) {
        const { error } = createUserValidation.validate({
          userName: "John Doe",
          password: "password123",
          phone: "1234567890",
          role,
        });
        expect(error).toBeUndefined();
      }
    });
  });

  describe("loginUser", () => {
    it("should pass with valid data", () => {
      const { error } = loginUser.validate({
        phone: "1234567890",
        password: "password123",
      });
      expect(error).toBeUndefined();
    });

    it("should fail when phone is missing", () => {
      const { error } = loginUser.validate({
        password: "password123",
      });
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("phone");
    });

    it("should fail when phone is less than 10 characters", () => {
      const { error } = loginUser.validate({
        phone: "12345",
        password: "password123",
      });
      expect(error).toBeDefined();
    });

    it("should fail when password is missing", () => {
      const { error } = loginUser.validate({
        phone: "1234567890",
      });
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("password");
    });

    it("should fail when password is empty string", () => {
      const { error } = loginUser.validate({
        phone: "1234567890",
        password: "",
      });
      expect(error).toBeDefined();
    });
  });
});
