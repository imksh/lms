import { verifyToken } from "../utils/jwt.js";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  let token;
  // 1. Try cookie first (httpOnly — more secure)
  if (req.cookies?.token) {
    token = req.cookies.token;
  }
  // 2. Fall back to Authorization: Bearer header (supports clients without cookies)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    return next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ message: "Not authorized, token verification failed" });
  }
};

/**
 * optionalProtect — attaches req.user if a valid token is present,
 * but NEVER rejects unauthenticated requests. Use on public routes
 * that return different data for logged-in vs. anonymous users.
 */
export const optionalProtect = async (req, res, next) => {
  let token;
  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(); // anonymous — continue without user

  try {
    const decoded = verifyToken(token);
    if (decoded) {
      const user = await User.findById(decoded.id).select("-password");
      if (user) req.user = user;
    }
  } catch (_) {
    // Invalid token — treat as anonymous
  }
  return next();
};

