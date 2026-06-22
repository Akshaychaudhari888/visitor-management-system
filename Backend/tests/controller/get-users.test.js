import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockFind = jest.fn();
jest.unstable_mockModule("../../src/models/User.js", () => ({
  default: { find: mockFind },
}));

const { default: getUsers } = await import(
  "../../src/controller/get-users.js"
);

describe("getUsers controller", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("should return users with HR and Manager roles", async () => {
    const users = [
      { _id: "1", userName: "HR User", role: "HR" },
      { _id: "2", userName: "Manager User", role: "Manager" },
    ];
    mockFind.mockResolvedValue(users);

    await getUsers(req, res);

    expect(mockFind).toHaveBeenCalledWith(
      { role: { $in: ["HR", "Manager"] } },
      { password: 0 }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: users,
    });
  });

  it("should exclude password field from results", async () => {
    mockFind.mockResolvedValue([]);

    await getUsers(req, res);

    expect(mockFind).toHaveBeenCalledWith(
      expect.anything(),
      { password: 0 }
    );
  });

  it("should return 500 on error", async () => {
    mockFind.mockRejectedValue(new Error("DB error"));

    await getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error while fetching users",
    });
  });
});
