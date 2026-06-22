import bcrypt from "bcryptjs";

const hashPassword = async () => {
  const password = process.argv[2];

  if (!password) {
    console.error("Usage: node hashPassword.js <password>");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
};

hashPassword();