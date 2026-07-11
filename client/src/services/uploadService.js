import { api } from "../config/api";

export const uploadService = {
  /**
   * Upload a single file to Cloudinary via the server.
   * @param {File} file - The file object from an <input type="file">
   * @returns {Promise<{ url: string, public_id: string }>}
   */
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
