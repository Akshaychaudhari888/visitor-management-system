import bcrypt from "bcryptjs";
import getUserDetails from "../processor/get-user-details.js";
import createUserAccount from "../processor/create-user.js";

const createUser = async (req, res, next) => {
  try {
    const { userName, password, phone, role } = req.body;

    const exitingUser = await getUserDetails({
      findBy: { phone },
      projection: { _id: 1 },
    });

    if (exitingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await createUserAccount({
      data: { userName, phone, password: hashPassword, role },
    });
    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export default createUser;
