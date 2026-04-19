import api from "./api.js";
import { absoluteUrlForUploadPath } from "../config/staticAssetBase.js";

export function getCourseImageUrl(path) {
  return absoluteUrlForUploadPath(path);
}

export async function getCourses() {
  const { data } = await api.get("/api/v1/courses");
  if (!data.success) throw new Error(data.message || "Failed to fetch courses");
  return data.data;
}

export async function getCourseByIdOrSlug(idOrSlug) {
  const { data } = await api.get(`/api/v1/courses/${encodeURIComponent(idOrSlug)}`);
  if (!data.success) throw new Error(data.message || "Failed to fetch course");
  return data.data;
}

export async function adminListCourses(params = {}) {
  const { data } = await api.get("/api/v1/admin/courses", { params });
  if (!data.success) throw new Error(data.message || "Failed to list courses");
  return data.data;
}

export async function adminGetCourse(id) {
  const { data } = await api.get(`/api/v1/admin/courses/${id}`);
  if (!data.success) throw new Error(data.message || "Failed to get course");
  return data.data;
}

export async function adminCreateCourse(body) {
  const { data } = await api.post("/api/v1/admin/courses", body);
  if (!data.success) throw new Error(data.message || "Failed to create course");
  return data.data;
}

export async function adminUpdateCourse(id, body) {
  const { data } = await api.put(`/api/v1/admin/courses/${id}`, body);
  if (!data.success) throw new Error(data.message || "Failed to update course");
  return data.data;
}

export async function adminDeleteCourse(id) {
  const { data } = await api.delete(`/api/v1/admin/courses/${id}`);
  if (!data.success) throw new Error(data.message || "Failed to delete course");
  return data;
}

export async function adminUploadCourseImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/api/v1/admin/courses/upload-image", formData);
  if (!data.success) throw new Error(data.message || "Upload failed");
  return data.data.path;
}
