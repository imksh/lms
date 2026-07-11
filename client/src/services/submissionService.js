import { api } from "../config/api";

export const submissionService = {
  // Student: get own submissions
  getMySubmissions: () =>
    api.get("/submissions/my"),

  // Student: submit a task
  submit: (topicId, sectionIndex, submissionType, submittedContent) =>
    api.post("/submissions", { topicId, sectionIndex, submissionType, submittedContent }),

  // Admin: get all submissions
  getAllSubmissions: () =>
    api.get("/submissions"),

  // Admin: evaluate a submission
  evaluate: (id, status, grade, feedback) =>
    api.put(`/submissions/${id}/evaluate`, { status, grade, feedback }),
};
