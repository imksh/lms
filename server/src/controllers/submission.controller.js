import Submission from "../models/submission.model.js";

// Student submits/updates a task answer
export const submitTask = async (req, res, next) => {
  try {
    const { topicId, sectionIndex, submissionType, submittedContent } = req.body;
    
    if (topicId === undefined || sectionIndex === undefined || !submissionType || submittedContent === undefined) {
      return res.status(400).json({ message: "Please provide topicId, sectionIndex, submissionType, and submittedContent" });
    }

    const submission = await Submission.findOneAndUpdate(
      { user: req.user._id, topicId, sectionIndex },
      {
        submissionType,
        submittedContent,
        status: "pending", // Reset status to pending on new/updated submission
        grade: null,
        feedback: "",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json(submission);
  } catch (error) {
    return next(error);
  }
};

// Student fetches their own submission history
export const getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ user: req.user._id });
    return res.status(200).json(submissions);
  } catch (error) {
    return next(error);
  }
};

import Topic from "../models/topic.model.js";
import Subject from "../models/subject.model.js";

// Admin fetches all submissions (supports filtering by status and pagination)
export const getAllSubmissions = async (req, res, next) => {
  try {
    const { status, userId, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== "all") query.status = status;
    if (userId) query.user = userId;

    if (req.user.role === "teacher") {
      const assignedIds = (req.user.module || []).map(String);
      const subjects = await Subject.find({ module: { $in: assignedIds } }).select("_id");
      const subjectIds = subjects.map(s => s._id);
      const topics = await Topic.find({ subject: { $in: subjectIds } }).select("topicId");
      const topicIds = topics.map(t => t.topicId);
      
      query.topicId = { $in: topicIds };
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const submissions = await Submission.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalCount = await Submission.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    // Fetch corresponding topics to attach module/subject info
    const topicIds = [...new Set(submissions.map(sub => sub.topicId))];
    const topics = await Topic.find({ topicId: { $in: topicIds } })
      .populate({
        path: "subject",
        populate: {
          path: "module",
          model: "Module"
        }
      })
      .lean();

    const topicMap = {};
    topics.forEach(t => {
      topicMap[t.topicId] = t;
    });

    const populatedSubmissions = submissions.map(sub => {
      const topic = topicMap[sub.topicId];
      return {
        ...sub,
        topicDetails: topic ? {
          title: topic.title,
          subject: topic.subject ? {
            title: topic.subject.title,
            module: topic.subject.module ? {
              title: topic.subject.module.title
            } : null
          } : null
        } : null
      };
    });

    return res.status(200).json({
      submissions: populatedSubmissions,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount
      }
    });
  } catch (error) {
    return next(error);
  }
};

// Admin evaluates and grades a submission
export const evaluateSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, grade, feedback } = req.body;

    if (!status || grade === undefined) {
      return res.status(400).json({ message: "Please provide status and grade" });
    }

    if (req.user.role === "teacher") {
      const submission = await Submission.findById(id);
      if (!submission) return res.status(404).json({ message: "Submission not found" });

      const assignedIds = (req.user.module || []).map(String);
      const subjects = await Subject.find({ module: { $in: assignedIds } }).select("_id");
      const subjectIds = subjects.map(s => s._id);
      const topics = await Topic.find({ subject: { $in: subjectIds } }).select("topicId");
      const topicIds = topics.map(t => t.topicId);

      if (!topicIds.includes(submission.topicId)) {
        return res.status(403).json({ message: "Access denied to evaluate this submission" });
      }
    }

    const submission = await Submission.findByIdAndUpdate(
      id,
      { status, grade: Number(grade), feedback },
      { new: true }
    ).populate("user", "name email");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.status(200).json(submission);
  } catch (error) {
    return next(error);
  }
};
