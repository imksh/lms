import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "lms_super_secret_key_123456";

export const generateToken = (payload, expiresIn = "30d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
