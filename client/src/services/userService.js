import { api } from "../config/api";

export const userService = {
  getUsers: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role) params.append("role", filters.role);
    if (filters.isApproved !== undefined) params.append("isApproved", filters.isApproved);
    if (filters.module) params.append("module", filters.module);
    return api.get(`/users?${params.toString()}`);
  },

  getUserById: (id) => api.get(`/users/${id}`),

  approveUser: (id, isApproved) =>
    api.put(`/users/${id}/approve`, { isApproved }),

  updateRole: (id, role) =>
    api.put(`/users/${id}/role`, { role }),

  assignModules: (id, moduleIds) =>
    api.put(`/users/${id}/module`, { moduleIds }),

  deleteUser: (id) => api.delete(`/users/${id}`),
};
