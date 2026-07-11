import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

const SALT_ROUNDS = 10;

export const registerUser = async (name, email, password) => {
  const userExists = await User.findOne({ email });
  const role = "student";

  if (userExists) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  // Explicitly hash password in the service layer
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  if (user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken({ id: user._id }),
    };
  } else {
    const error = new Error("Invalid user data");
    error.statusCode = 400;
    throw error;
  }
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).lean();

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Explicitly compare using bcrypt
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Strip sensitive fields from the plain object
  const { password: _pw, __v, ...safeUser } = user;

  return {
    ...safeUser,
    token: generateToken({ id: user._id }),
  };
};


export const updateUserProfile = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (updates.name) user.name = updates.name;
  if (updates.email) user.email = updates.email;
  if (updates.password) {
    user.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
  }

  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
