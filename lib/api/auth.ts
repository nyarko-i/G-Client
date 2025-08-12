import axios from "axios";
import type { Course } from "@/lib/types/course";
import type { Track } from "@/lib/types/track";



// Axios instance
const api = axios.create({
  baseURL: "/api", // this will get rewritten via next.config.js proxy
});

// lib/api/auth.ts

export const logout = async () => {
  // example: clear cookies/session by calling your backend logout endpoint
  return axios.post("/api/logout");
};


// GET all courses
export const getCourses = async () => {
  return api.get<Course[]>("/courses");
};

// GET all tracks
export const getTracks = async () => {
  return api.get<Track[]>("/tracks");
};

// CREATE a course
export const createCourse = async (formData: FormData) => {
  return api.post<Course>("/courses", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// UPDATE a course
export const updateCourse = async (id: string, formData: FormData) => {
  return api.put<Course>(`/courses/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE a course
export const deleteCourse = async (id: string) => {
  return api.delete(`/courses/${id}`);
};
