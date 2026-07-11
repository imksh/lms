/** Middleware: allow only admins */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Admins only" });
};

/** Middleware: allow teachers OR admins (content management) */
export const teacherOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "teacher" || req.user.role === "admin")) {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Access denied: Teachers and Admins only" });
};
