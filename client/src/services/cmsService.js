import { api } from "../config/api";

export const cmsService = {
  // ─── Modules ───────────────────────────────────────────────────
  getModules: () => api.get("/modules"),
  getModuleById: (id) => api.get(`/modules/${id}`),
  createModule: (data) => api.post("/modules", data),
  updateModule: (id, data) => api.put(`/modules/${id}`, data),
  deleteModule: (id) => api.delete(`/modules/${id}`),
  reorderModules: (orderData) => api.put("/modules/reorder", { orderData }),
  assignTeacher: (moduleId, subjectKey, teacherId) =>
    api.put(`/modules/${moduleId}/assign-teacher`, { subjectKey, teacherId }),

  // ─── Subjects ──────────────────────────────────────────────────
  getSubjects: (params) => api.get("/cms/subjects", { params }),
  createSubject: (data) => api.post("/cms/subjects", data),
  reorderSubjects: (orderData) => api.put("/cms/subjects/reorder", { orderData }),
  updateSubject: (key, data) => api.put(`/cms/subjects/${key}`, data),
  deleteSubject: (key) => api.delete(`/cms/subjects/${key}`),

  // ─── Topics ────────────────────────────────────────────────────
  getTopics: (params) =>
    api.get("/cms/topics", { params: params || {} }),
  createTopic: (data) => api.post("/cms/topics", data),
  updateTopic: (topicId, data) =>
    api.put(`/cms/topics/${encodeURIComponent(topicId)}`, data),
  deleteTopic: (topicId) =>
    api.delete(`/cms/topics/${encodeURIComponent(topicId)}`),

  // ─── Meta ──────────────────────────────────────────────────────
  getMeta: () => api.get("/meta"),
  updateMeta: (data) => api.put("/meta", data),
};
