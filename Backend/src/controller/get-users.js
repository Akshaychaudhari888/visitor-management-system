import User from "../models/User.js";

const getUsers = async (req, res) => {
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
    return res.status(500).json({
      success: false,
      message: 'Error while fetching users',
    });
  }
};

export default getUsers;