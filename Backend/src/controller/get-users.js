import User from "../models/User.js";

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find(
      {
        role: {
          $in: ["HR", "Manager"],
        },
      },
      {
        password: 0,
      }
    );

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export default getUsers;