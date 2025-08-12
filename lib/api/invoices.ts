/* eslint-disable @typescript-eslint/no-unused-vars */
/* lib/api/invoices.ts */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { Invoice, InvoiceStatus } from "@/lib/types/invoice";

/**
 * Axios instance — uses your Next.js rewrites (/api -> remote)
 */
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------- payload types ---------- */
export type CreateInvoicePayload = {
  learner: string;
  paystackCallbackUrl: string;
  amount?: number;
  dueDate?: string;
  paymentDetails?: string;
  track?: string;
};

export type UpdateInvoicePayload = {
  amount?: number;
  dueDate?: string;
  status?: InvoiceStatus;
  paymentDetails?: string;
};

/* ---------- helpers ---------- */

function cleanPayload<T extends Record<string, any>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined && v !== null)
  ) as T;
}

/**
 * Extract a clear message from different axios / network error shapes.
 */
function extractErrorMessage(err: any): string {
  try {
    if (err?.response) {
      const status = err.response.status;
      const data = err.response.data;

      // If server returns an errors array (common), show the first message
      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        const msgs = data.errors.map((e: any) => e.message ?? JSON.stringify(e));
        return `Request failed (${status}): ${msgs.join("; ")}`;
      }

      const serverMsg =
        (data && (data.message || data.error || data.msg)) ??
        (typeof data === "string" ? data : JSON.stringify(data ?? {}));

      return `Request failed (${status}): ${serverMsg}`;
    }

    if (err?.request) {
      return "No response received from server (check network / proxy).";
    }

    return err?.message ?? String(err);
  } catch (e) {
    return String(err);
  }
}

/**
 * Normalizes raw backend invoice shapes to the frontend Invoice type.
 */
export function normalizeInvoice(raw: any): Invoice {
  if (!raw) return {} as Invoice;
  const src: any = raw.invoice ?? raw;

  const id = src.id ?? src._id ?? "";
  const learnerObj = src.learner ?? src.learnerId ?? null;

  const learnerName =
    (learnerObj &&
      `${learnerObj.firstName ?? learnerObj.first_name ?? ""} ${learnerObj.lastName ?? learnerObj.last_name ?? ""}`.trim()) ||
    src.learnerName ||
    src.learner_name ||
    "";

  const learnerEmail = learnerObj?.email ?? src.learnerEmail ?? src.learner_email ?? "";

  const dateCreated = src.createdAt ?? src.dateCreated ?? "";

  return {
    id,
    learnerName,
    learnerEmail,
    dateCreated,
    amount: Number(src.amount ?? 0),
    status: (src.status ?? "pending") as InvoiceStatus,
    dueDate: src.dueDate ?? undefined,
    paymentDetails: src.paymentDetails ?? undefined,
    raw: src,
  } as Invoice;
}

/* ---------- API functions ---------- */

export async function fetchInvoices(): Promise<Invoice[]> {
  try {
    const res = await api.get("/invoices");
    const data: any = res?.data ?? {};

    if (Array.isArray(data)) return data.map(normalizeInvoice);
    if (Array.isArray(data?.invoices)) return data.invoices.map(normalizeInvoice);
    if (Array.isArray(data?.data)) return data.data.map(normalizeInvoice);
    if (data?.invoice) return [normalizeInvoice(data.invoice)];
    if (typeof data === "object" && (data._id || data.id || data.learner)) return [normalizeInvoice(data)];

    return [];
  } catch (err: any) {
    // Print detailed info for debugging
    console.error("fetchInvoices error - response:", err?.response ?? err);
    throw new Error(extractErrorMessage(err));
  }
}

export async function createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
  try {
    const clean = cleanPayload(payload);
    // Debuggable log
    console.debug("[createInvoice] request payload:", clean);
    const res = await api.post("/invoices", clean);
    const data: any = res?.data ?? {};
    console.debug("[createInvoice] response:", data);

    if (data?.invoice) return normalizeInvoice(data.invoice);
    if (Array.isArray(data)) return normalizeInvoice(data[0]);
    return normalizeInvoice(data);
  } catch (err: any) {
    // Log the full axios error object (useful during development)
    console.error("createInvoice error:", err);
    // Throw a helpful Error with server details
    throw new Error(extractErrorMessage(err));
  }
}

export async function updateInvoice(id: string, payload: UpdateInvoicePayload): Promise<Invoice> {
  try {
    const clean = cleanPayload(payload);
    console.debug("[updateInvoice] id:", id, "payload:", clean);
    const res = await api.put(`/invoices/${id}`, clean);
    const data: any = res?.data ?? {};
    console.debug("[updateInvoice] response:", data);
    if (data?.invoice) return normalizeInvoice(data.invoice);
    return normalizeInvoice(data);
  } catch (err: any) {
    console.error("updateInvoice error:", err);
    throw new Error(extractErrorMessage(err));
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  try {
    console.debug("[deleteInvoice] id:", id);
    await api.delete(`/invoices/${id}`);
  } catch (err: any) {
    console.error("deleteInvoice error:", err);
    throw new Error(extractErrorMessage(err));
  }
}
