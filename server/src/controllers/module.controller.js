import Module from "../models/module.model.js";
import Subject from "../models/subject.model.js";

// GET /api/modules — returns modules the user can access
// - admin/teacher: all modules
// - authenticated student: their assigned modules + all public modules
// - anonymous: only public modules
export const getModules = async (req, res, next) => {
  try {
    const user = req.user;

    let query = {};

    if (!user) {
      // Anonymous — only public
      query = { isPublic: true };
    } else if (user.role === "admin" || user.role === "teacher") {
      // Full access
      query = {};
    } else {
      // Student — assigned modules OR public
      const assignedIds = user.module || [];
      query = {
        $or: [{ _id: { $in: assignedIds } }, { isPublic: true }],
      };
    }

    const modules = await Module.find(query).sort({ order: 1 });

    // Attach subjects for each module (same visibility rules for subjects below)
    const populated = await Promise.all(
      modules.map(async (mod) => {
        const subjectQuery = buildSubjectQuery(user, mod._id, mod.isPublic);
        const subjects = await Subject.find(subjectQuery)
          .populate("teacher", "name email")
          .sort({ order: 1 });
        return { ...mod.toObject(), subjects };
      }),
    );

    return res.status(200).json(populated);
  } catch (error) {
    return next(error);
  }
};

// GET /api/modules/:id — single module with subjects
export const getModuleById = async (req, res, next) => {
  try {
    const mod = await Module.findById(req.params.id);
    if (!mod) return res.status(404).json({ message: "Module not found" });

    const user = req.user;
    const subjectQuery = buildSubjectQuery(user, mod._id, mod.isPublic);
    const subjects = await Subject.find(subjectQuery)
      .populate("teacher", "name email")
      .sort({ order: 1 });

    return res.status(200).json({ ...mod.toObject(), subjects });
  } catch (error) {
    return next(error);
  }
};

// POST /api/modules — admin only
export const createModule = async (req, res, next) => {
  try {
    const { title, description, icon, color, iconColor, path, order, isPublic } =
      req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }
    const mod = await Module.create({
      title,
      description,
      icon,
      color,
      iconColor,
      path,
      order: Number(order) || 0,
      isPublic: Boolean(isPublic),
    });
    return res.status(201).json(mod);
  } catch (error) {
    return next(error);
  }
};

// PUT /api/modules/:id — admin only
export const updateModule = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (updateData.order !== undefined) updateData.order = Number(updateData.order);
    if (updateData.isPublic !== undefined) updateData.isPublic = Boolean(updateData.isPublic);

    const mod = await Module.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!mod) return res.status(404).json({ message: "Module not found" });
    return res.status(200).json(mod);
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/modules/:id — admin only
export const deleteModule = async (req, res, next) => {
  try {
    const mod = await Module.findByIdAndDelete(req.params.id);
    if (!mod) return res.status(404).json({ message: "Module not found" });
    // Unlink subjects (don't cascade-delete, just detach)
    await Subject.updateMany({ module: mod._id }, { $unset: { module: 1 } });
    return res
      .status(200)
      .json({ message: "Module deleted, subjects detached" });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/modules/:id/assign-teacher — admin assigns a teacher to a subject
export const assignTeacher = async (req, res, next) => {
  try {
    const { subjectKey, teacherId } = req.body;
    if (!subjectKey || !teacherId) {
      return res
        .status(400)
        .json({ message: "subjectKey and teacherId are required" });
    }
    const subject = await Subject.findOneAndUpdate(
      { key: subjectKey },
      { teacher: teacherId },
      { new: true },
    ).populate("teacher", "name email");
    if (!subject)
      return res.status(404).json({ message: "Subject not found" });
    return res.status(200).json(subject);
  } catch (error) {
    return next(error);
  }
};

/**
 * Build a Mongoose query for subjects accessible to the given user
 * within a specific module.
 * @param {object|null} user - req.user
 * @param {ObjectId} moduleId
 * @param {boolean} moduleIsPublic - if the parent module itself is public
 */
function buildSubjectQuery(user, moduleId, moduleIsPublic) {
  // If module is public, all its subjects are implicitly accessible
  if (moduleIsPublic) {
    return { module: moduleId };
  }

  if (!user) {
    // Anonymous — only explicitly public subjects in this module
    return { module: moduleId, isPublic: true };
  }

  if (user.role === "admin" || user.role === "teacher") {
    return { module: moduleId };
  }

  // Student whose module list includes this module → full access to subjects
  const assigned = (user.module || []).map(String);
  if (assigned.includes(String(moduleId))) {
    return { module: moduleId };
  }

  // Module is not assigned but we're here (shouldn't happen in normal flow)
  return { module: moduleId, isPublic: true };
}

// PUT /api/modules/reorder — admin only
export const reorderModules = async (req, res, next) => {
  try {
    const { orderData } = req.body;
    if (!Array.isArray(orderData)) return res.status(400).json({ message: "orderData must be an array" });

    const ops = orderData.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order }
      }
    }));
    if (ops.length > 0) {
      await Module.bulkWrite(ops);
    }
    return res.status(200).json({ message: "Modules reordered successfully" });
  } catch (error) {
    return next(error);
  }
};


