/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/types/invoice.ts
export enum InvoiceStatus {
  PAID = "paid",
  PENDING = "pending",
  OVERDUE = "overdue",
}

/**
 * Frontend Invoice shape (normalized)
 * This is the shape used inside the UI components.
 */
export interface Invoice {
  id: string;
  learnerName: string;
  learnerEmail: string;
  dateCreated: string;
  amount: number;
  status: InvoiceStatus;
  dueDate?: string;
  paymentDetails?: string;
  // keep space for any extra backend fields if needed
  [k: string]: any;
}
