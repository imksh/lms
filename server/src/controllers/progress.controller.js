import * as progressService from "../services/progress.service.js";

export const getProgress = async (req, res, next) => {
  try {
    const completedTopics = await progressService.getProgressByUser(req.user._id);
    return res.status(200).json(completedTopics);
  } catch (error) {
    return next(error);
  }
};

export const toggleProgress = async (req, res, next) => {
  try {
    const { topicId } = req.body;
    if (!topicId) {
      return res.status(400).json({ message: "Please provide topicId" });
    }
    const completedTopics = await progressService.toggleProgress(req.user._id, topicId);
    return res.status(200).json(completedTopics);
  } catch (error) {
    return next(error);
  }
};
