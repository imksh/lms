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

// Admin fetches all submissions (supports filtering by status)
export const getAllSubmissions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const submissions = await Submission.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return res.status(200).json(submissions);
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
