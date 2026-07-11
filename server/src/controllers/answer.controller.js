import * as answerService from "../services/answer.service.js";

export const getAnswers = async (req, res, next) => {
  try {
    const answers = await answerService.getAnswersByUser(req.user._id);
    return res.status(200).json(answers);
  } catch (error) {
    return next(error);
  }
};

export const saveAnswer = async (req, res, next) => {
  try {
    const { topicId, questionIndex, code } = req.body;
    if (!topicId || questionIndex === undefined || code === undefined) {
      return res.status(400).json({ message: "Please provide topicId, questionIndex, and code" });
    }
    const answer = await answerService.saveAnswer(req.user._id, topicId, Number(questionIndex), code);
    return res.status(200).json(answer);
  } catch (error) {
    return next(error);
  }
};
