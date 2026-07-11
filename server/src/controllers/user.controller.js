import User from "../models/user.model.js";

// GET /api/users
export const getUsers = async (req, res, next) => {
  try {
    const { role, isApproved, module: moduleId } = req.query;
    const filter = {};

    if (role) filter.role = role;
    
    if (isApproved !== undefined) {
      filter.isApproved = isApproved === "true";
    }

    if (moduleId) {
      if (moduleId === "unassigned") {
        filter.module = null;
        filter.role = "student";
      } else {
        filter.module = moduleId;
      }
    }

    const users = await User.find(filter)
      .populate("module", "title _id")
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

// GET /api/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("module", "title _id")
      .select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

// PUT /api/users/:id/approve
export const approveUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

// PUT /api/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["student", "teacher", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

// PUT /api/users/:id/module — assign multiple modules (array)
export const assignUserModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { moduleIds } = req.body; // array of ObjectId strings

    const user = await User.findByIdAndUpdate(
      id,
      { module: Array.isArray(moduleIds) ? moduleIds : [] },
      { new: true }
    ).select("-password").populate("module", "title _id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
