const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");

const createUser = async function ({ userData }, req) {
  const { name, email, password } = userData;

  const errors = [];

  if (!validator.isEmail(email)) {
    errors.push({ message: "Email address is not valid" });
  }

  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: 5 })
  ) {
    errors.push({ message: "Password must be atleast 5 chars" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    errors.push({ message: "User & password do not match" });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({ name, email, password: hashedPassword });

  await user.save();

  return { _id: user.id };
};

module.exports = createUser;
