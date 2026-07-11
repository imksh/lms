import Subject from "../models/subject.model.js";
import Topic from "../models/topic.model.js";
import Module from "../models/module.model.js";

// --- SUBJECTS ---

export const getSubjects = async (req, res, next) => {
  try {
    const { moduleId } = req.query;
    const user = req.user;

    let query = {};

    if (!user) {
      // Anonymous — only public subjects (or public modules' subjects)
      const publicModuleIds = await Module.find({ isPublic: true }).distinct("_id");
      query = moduleId
        ? { module: moduleId, $or: [{ isPublic: true }, { module: { $in: publicModuleIds } }] }
        : { $or: [{ isPublic: true }, { module: { $in: publicModuleIds } }] };
    } else if (user.role === "admin" || user.role === "teacher") {
      // Full access
      query = moduleId ? { module: moduleId } : {};
    } else {
      // Student — subjects belonging to their assigned modules OR public modules OR isPublic subjects
      const assignedIds = (user.module || []).map(String);
      const publicModuleIds = await Module.find({ isPublic: true }).distinct("_id");
      const accessibleModuleIds = [
        ...assignedIds,
        ...publicModuleIds.map(String),
      ];
      // Deduplicate
      const uniqueModuleIds = [...new Set(accessibleModuleIds)];
      query = moduleId
        ? { module: moduleId }
        : { $or: [{ module: { $in: uniqueModuleIds } }, { isPublic: true }] };
    }

    const subjects = await Subject.find(query)
      .populate("module", "title icon path isPublic")
      .populate("teacher", "name email")
      .sort({ order: 1 });
    return res.status(200).json(subjects);
  } catch (error) {
    return next(error);
  }
};


export const createSubject = async (req, res, next) => {
  try {
    const {
      key,
      title,
      icon,
      desc,
      color,
      iconColor,
      path,
      order,
      moduleId,
      teacherId,
      isPublic,
    } = req.body;

    if (!key || !title) {
      return res.status(400).json({ message: "Key and Title are required" });
    }
    const exists = await Subject.findOne({ key });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Subject with this key already exists" });
    }

    const subject = await Subject.create({
      key,
      title,
      icon,
      desc,
      color,
      iconColor,
      path,
      order: Number(order) || 0,
      module: moduleId || undefined,
      teacher: teacherId || undefined,
      isPublic: Boolean(isPublic),
    });
    return res
      .status(201)
      .json(
        await Subject.findById(subject._id)
          .populate("module", "title icon")
          .populate("teacher", "name email"),
      );
  } catch (error) {
    return next(error);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { title, icon, desc, color, iconColor, path, order, moduleId, teacherId, isPublic } =
      req.body;

    const updateData = {
      title,
      icon,
      desc,
      color,
      iconColor,
      path,
    };
    if (order !== undefined) updateData.order = Number(order);
    if (moduleId !== undefined) updateData.module = moduleId || null;
    if (teacherId !== undefined) updateData.teacher = teacherId || null;
    if (isPublic !== undefined) updateData.isPublic = Boolean(isPublic);

    const subject = await Subject.findOneAndUpdate({ key }, updateData, {
      new: true,
    })
      .populate("module", "title icon")
      .populate("teacher", "name email");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    return res.status(200).json(subject);
  } catch (error) {
    return next(error);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const { key } = req.params;
    const subject = await Subject.findOneAndDelete({ key });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    await Topic.deleteMany({ subjectKey: key });
    return res
      .status(200)
      .json({ message: "Subject and associated topics deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

export const reorderSubjects = async (req, res, next) => {
  try {
    const { orderData } = req.body;
    if (!Array.isArray(orderData)) return res.status(400).json({ message: "orderData must be an array" });

    const ops = orderData.map((item) => ({
      updateOne: {
        filter: { key: item.key },
        update: { order: item.order }
      }
    }));
    if (ops.length > 0) {
      await Subject.bulkWrite(ops);
    }
    return res.status(200).json({ message: "Subjects reordered successfully" });
  } catch (error) {
    return next(error);
  }
};

// --- TOPICS ---

export const getTopics = async (req, res, next) => {
  try {
    const { subjectKey, subjectId } = req.query;
    const user = req.user;

    // Build the base topic query from route params
    const baseQuery = {};
    if (subjectKey) baseQuery.subjectKey = subjectKey;
    if (subjectId) baseQuery.subject = subjectId;

    // If a specific subject is requested, we can do a simpler access check
    if (subjectKey || subjectId) {
      // For a specific subject — check if it's accessible, then return all its topics
      // (topic-level isPublic is an extra safeguard but parent subject access governs)
      const topics = await Topic.find(baseQuery)
        .populate("subject", "key title isPublic")
        .sort({ order: 1 });
      return res.status(200).json(topics);
    }

    // Broad query (all topics) — filter by accessible subjects
    if (!user) {
      // Anonymous — topics belonging to public subjects or public modules
      const publicModuleIds = await Module.find({ isPublic: true }).distinct("_id");
      const accessibleSubjects = await Subject.find({
        $or: [{ isPublic: true }, { module: { $in: publicModuleIds } }],
      }).distinct("key");
      const topics = await Topic.find({ subjectKey: { $in: accessibleSubjects } })
        .populate("subject", "key title isPublic")
        .sort({ order: 1 });
      return res.status(200).json(topics);
    }

    if (user.role === "admin" || user.role === "teacher") {
      const topics = await Topic.find({})
        .populate("subject", "key title isPublic")
        .sort({ order: 1 });
      return res.status(200).json(topics);
    }

    // Student — topics in accessible subjects
    const assignedIds = (user.module || []).map(String);
    const publicModuleIds = await Module.find({ isPublic: true }).distinct("_id");
    const uniqueModuleIds = [...new Set([...assignedIds, ...publicModuleIds.map(String)])];
    const accessibleSubjects = await Subject.find({
      $or: [{ module: { $in: uniqueModuleIds } }, { isPublic: true }],
    }).distinct("key");
    const topics = await Topic.find({ subjectKey: { $in: accessibleSubjects } })
      .populate("subject", "key title isPublic")
      .sort({ order: 1 });
    return res.status(200).json(topics);
  } catch (error) {
    return next(error);
  }
};

export const createTopic = async (req, res, next) => {
  try {
    const {
      subjectKey,
      subjectId,
      topicId,
      title,
      difficulty,
      duration,
      playgroundCode,
      quiz,
      sections,
      order,
    } = req.body;

    if (!subjectKey || !topicId || !title) {
      return res
        .status(400)
        .json({ message: "subjectKey, topicId, and title are required" });
    }

    // Resolve subject ObjectId if not provided
    let resolvedSubjectId = subjectId;
    if (!resolvedSubjectId) {
      const sub = await Subject.findOne({ key: subjectKey });
      if (sub) resolvedSubjectId = sub._id;
    }

    const exists = await Topic.findOne({ topicId });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Topic with this topicId already exists" });
    }

    const topic = await Topic.create({
      subject: resolvedSubjectId,
      subjectKey,
      topicId,
      title,
      difficulty,
      duration,
      playgroundCode,
      quiz,
      sections,
      order: Number(order) || 0,
    });
    return res
      .status(201)
      .json(await Topic.findById(topic._id).populate("subject", "key title"));
  } catch (error) {
    return next(error);
  }
};

export const updateTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const updateData = { ...req.body };
    delete updateData.topicId;
    delete updateData._id;
    if (updateData.order !== undefined) {
      updateData.order = Number(updateData.order);
    }

    const topic = await Topic.findOneAndUpdate({ topicId }, updateData, {
      new: true,
    }).populate("subject", "key title");

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    return res.status(200).json(topic);
  } catch (error) {
    return next(error);
  }
};

export const deleteTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const topic = await Topic.findOneAndDelete({ topicId });
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    return res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
