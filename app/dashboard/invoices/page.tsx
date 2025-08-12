import type { Metadata } from "next";
import InvoicesPageContent from "@/components/invoices/invoices-page-content";

// Metadata for the invoices page
export const metadata: Metadata = {
  title: "Manage Invoices - LMS Portal",
  description:
    "Filter, sort, and access detailed invoices in the Learning Management System",
};

/**
 * Invoices page component
 * Main page for displaying all available invoices in a table layout
 */
export default function InvoicesPage() {
  return <InvoicesPageContent />;
}
