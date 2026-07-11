import { api } from "../config/api";

export const userDataService = {
  // Notes
  getNotes: () =>
    api.get("/notes"),

  saveNote: (topicId, content) =>
    api.post("/notes", { topicId, content }),

  // Progress
  getProgress: () =>
    api.get("/progress"),

  toggleProgress: (topicId) =>
    api.post("/progress/toggle", { topicId }),

  // Answers
  getAnswers: () =>
    api.get("/answers"),

  saveAnswer: (topicId, questionIndex, code) =>
    api.post("/answers", { topicId, questionIndex, code }),
};
