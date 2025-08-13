/* eslint-disable @typescript-eslint/no-explicit-any */
/* lib/api/learners.ts */

import axios from "axios";
import { Learner, LearnerStatus } from "@/lib/types/learner";

/**
 * Axios instance — uses Next.js rewrites (/api -> remote backend)
 */
const api = axios.create({
  baseURL: "/api",
});

/* ---------- Payload Types ---------- */
export type UpdateLearnerPayload = {
  profileImage?: File;
  contact?: string;
  disabled?: boolean;
  location?: string;
  description?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  country?: string;
  paidStatus?: string;
  program?: string;
};

/* ---------- Helpers ---------- */
function extractErrorMessage(err: any): string {
  try {
    if (err?.response) {
      const status = err.response.status;
      const data = err.response.data;

      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        const msgs = data.errors.map((e: any) => e.message ?? JSON.stringify(e));
        return `Request failed (${status}): ${msgs.join("; ")}`;
      }

      const serverMsg =
        data?.message || data?.error || data?.msg ||
        (typeof data === "string" ? data : JSON.stringify(data ?? {}));

      return `Request failed (${status}): ${serverMsg}`;
    }

    if (err?.request) {
      return "No response received from server (check network / proxy).";
    }

    return err?.message ?? String(err);
  } catch {
    return String(err);
  }
}

/**
 * Normalize raw learner shape from backend into Learner type
 */
export function normalizeLearner(raw: any): Learner {
  if (!raw) return {} as Learner;

  const src: any = raw.learner ?? raw;

  const id = src.id ?? src._id ?? "";
  const firstName = src.firstName ?? src.first_name ?? "";
  const lastName = src.lastName ?? src.last_name ?? "";
  const email = src.email ?? "";
  const dateJoined = src.createdAt ?? src.dateCreated ?? "";
  const coursesEnrolled = src.coursesEnrolled ?? src.courses_count ?? 0;

  // Status fallback logic
  let status: LearnerStatus;
  if (src.status) {
    status = src.status as LearnerStatus;
  } else if (src.disabled === true) {
    status = LearnerStatus.INACTIVE;
  } else {
    status = LearnerStatus.ACTIVE;
  }

  return {
    id,
    name: `${firstName} ${lastName}`.trim(),
    email,
    dateJoined,
    coursesEnrolled: Number(coursesEnrolled),
    status,
    avatar: src.profileImage ?? src.avatar ?? "",
    program: src.program ?? src.track ?? "",
    gender: src.gender ?? "",
    contact: src.contact ?? "",
    country: src.country ?? src.location ?? "",
    paidStatus: src.paidStatus ?? src.paymentStatus ?? "",
    description: src.description ?? "",
  } as Learner;
}

/* ---------- API Functions ---------- */

/**
 * Fetch all learners
 */
export async function getLearners(): Promise<Learner[]> {
  try {
    // Using axios instance to fetch learners from /api/learners (Next.js rewrite → backend)
    const res = await api.get("/learners");
    const data: any = res?.data ?? {};

    if (Array.isArray(data)) return data.map(normalizeLearner);
    if (Array.isArray(data?.learners)) return data.learners.map(normalizeLearner);
    if (Array.isArray(data?.data)) return data.data.map(normalizeLearner);
    if (data?.learner) return [normalizeLearner(data.learner)];
    if (typeof data === "object" && (data._id || data.id || data.email)) {
      return [normalizeLearner(data)];
    }

    return [];
  } catch (err: any) {
    console.error("getLearners error:", err);
    throw new Error(extractErrorMessage(err));
  }
}

/**
 * Update learner profile by ID
 */
export async function updateLearner(id: string, payload: UpdateLearnerPayload): Promise<Learner> {
  try {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    const res = await api.put(`/learners/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const data: any = res?.data ?? {};
    if (data?.learner) return normalizeLearner(data.learner);
    return normalizeLearner(data);
  } catch (err: any) {
    console.error("updateLearner error:", err);
    throw new Error(extractErrorMessage(err));
  }
}

/**
 * Delete learner by ID
 */
export async function deleteLearner(id: string): Promise<boolean> {
  try {
    await api.delete(`/learners/${id}`);
    return true;
  } catch (err: any) {
    console.error("deleteLearner error:", err);
    throw new Error(extractErrorMessage(err));
  }
}
