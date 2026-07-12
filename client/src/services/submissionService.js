import { api } from "../config/api";

export const submissionService = {
  // Student: get own submissions
  getMySubmissions: () =>
    api.get("/submissions/my"),

  // Student: submit a task
  submit: (topicId, sectionIndex, submissionType, submittedContent) =>
    api.post("/submissions", { topicId, sectionIndex, submissionType, submittedContent }),

  // Admin: get all submissions (optionally filter by userId)
  getAllSubmissions: (status, page = 1, limit = 20, userId = null) =>
    api.get("/submissions", { params: { status, page, limit, userId } }),

  // Admin: evaluate a submission
  evaluate: (id, status, grade, feedback) =>
    api.put(`/submissions/${id}/evaluate`, { status, grade, feedback }),
};
