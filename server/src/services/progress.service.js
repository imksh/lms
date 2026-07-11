import Progress from "../models/progress.model.js";

export const getProgressByUser = async (userId) => {
  let progress = await Progress.findOne({ user: userId });
  if (!progress) {
    progress = await Progress.create({ user: userId, completedTopics: [] });
  }
  return progress.completedTopics;
};

export const toggleProgress = async (userId, topicId) => {
  let progress = await Progress.findOne({ user: userId });
  if (!progress) {
    progress = await Progress.create({ user: userId, completedTopics: [topicId] });
    return progress.completedTopics;
  }

  const isCompleted = progress.completedTopics.includes(topicId);
  if (isCompleted) {
    progress.completedTopics = progress.completedTopics.filter((p) => p !== topicId);
  } else {
    progress.completedTopics.push(topicId);
  }

  await progress.save();
  return progress.completedTopics;
};
