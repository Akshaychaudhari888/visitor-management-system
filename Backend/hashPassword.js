import bcrypt from "bcryptjs";

const hashPassword = async () => {
  const hash = await bcrypt.hash("admin@123", 10);

  console.log(hash);
};

hashPassword();