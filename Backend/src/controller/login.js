import getUserDetails from "../processor/get-user-details.js";
import {generateToken} from '../utils/jwt.js'
import bcrypt from "bcryptjs";


const login = async (req, res) => {
  try {
    console.log("api called");
    const { phone, password } = req.body;

    const user = await getUserDetails({findBy: {phone}})

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }
    const token = generateToken(
      {
        userId: user._id,
        role: user.role,
      }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while login",
    });
  }
};

export default login;