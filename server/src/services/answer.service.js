import Answer from "../models/answer.model.js";

export const getAnswersByUser = async (userId) => {
  return await Answer.find({ user: userId });
};

export const saveAnswer = async (userId, topicId, questionIndex, code) => {
  const answer = await Answer.findOneAndUpdate(
    { user: userId, topicId, questionIndex },
    { code },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return answer;
};
