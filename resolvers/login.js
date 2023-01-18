const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");

const loginUser = async function ({ email, password }) {
  const user = await User.findOne({ email });

  const errors = [];

  if (!user) {
    errors.push({ message: "Email & Password don't match" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    errors.push({ message: "Email & Password don't match" });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input");
    error.data = errors;
    error.code = 401;
    throw error;
  }

  return { user: user._id.toString() };
};

module.exports = loginUser;
