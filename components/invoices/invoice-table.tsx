/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Invoice } from "@/lib/types/invoice";
import { InvoiceStatus } from "@/lib/types/invoice";

interface InvoicesTableProps {
  invoices: Invoice[] | null;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void | Promise<void>;
  loading?: boolean;
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const getStringField = (
  invoice: unknown,
  field: string
): string | undefined => {
  if (!isRecord(invoice)) return undefined;
  const val = invoice[field];
  return typeof val === "string" ? val : undefined;
};

const getNumberField = (
  invoice: unknown,
  field: string
): number | undefined => {
  if (!isRecord(invoice)) return undefined;
  const val = invoice[field];
  return typeof val === "number" ? val : undefined;
};

const getInvoiceId = (invoice: unknown): string => {
  // prefer `id`, fall back to `_id`, otherwise empty string
  return getStringField(invoice, "id") ?? getStringField(invoice, "_id") ?? "";
};

const getLearnerName = (invoice: unknown): string => {
  // check learnerName field first, else check nested learner object
  const byName = getStringField(invoice, "learnerName");
  if (byName) return byName;

  if (!isRecord(invoice)) return "";
  const learner = invoice["learner"];
  if (isRecord(learner)) {
    const first =
      typeof learner["firstName"] === "string" ? learner["firstName"] : "";
    const last =
      typeof learner["lastName"] === "string" ? learner["lastName"] : "";
    const name = `${first} ${last}`.trim();
    if (name) return name;
    if (typeof learner["email"] === "string") return learner["email"];
  }

  // fallback to learnerEmail property
  return getStringField(invoice, "learnerEmail") ?? "";
};

const getLearnerEmail = (invoice: unknown): string =>
  getStringField(invoice, "learnerEmail") ??
  (isRecord(invoice) &&
  isRecord(invoice["learner"]) &&
  typeof invoice["learner"]["email"] === "string"
    ? (invoice["learner"]["email"] as string)
    : "");

export default function InvoicesTable({
  invoices,
  onEdit,
  onDelete,
  loading = false,
}: InvoicesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const invoicesPerPage = 6;

  // Memoize invoices or fallback to empty array
  const safeInvoices = useMemo(
    () => (Array.isArray(invoices) ? invoices : []),
    [invoices]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(safeInvoices.length / invoicesPerPage)
  );
  const startIndex = (currentPage - 1) * invoicesPerPage;
  const currentInvoices = safeInvoices.slice(
    startIndex,
    startIndex + invoicesPerPage
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [safeInvoices]);

  const handleDelete = async (invoiceId: string, learnerName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the invoice for "${learnerName}"?`
      )
    )
      return;

    try {
      setDeletingId(invoiceId);
      const result = onDelete(invoiceId);
      if (result instanceof Promise) await result;
      toast.success(`Invoice for "${learnerName}" has been deleted.`);
    } catch (err: unknown) {
      console.error("Delete failed:", err);
      const msg =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: unknown }).message)
          : "Failed to delete invoice.";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadgeClass = (status: unknown) => {
    if (status === InvoiceStatus.PAID) return "bg-green-100 text-green-600";
    if (status === InvoiceStatus.PENDING)
      return "bg-yellow-100 text-yellow-600";
    if (status === InvoiceStatus.OVERDUE) return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  const getLearnerInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0] ?? "")
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getLearnerColor = (name = "") => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-yellow-500",
    ];
    return colors[name.length % colors.length];
  };

  return (
    <Card
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <CardContent className="p-0">
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm text-gray-700">
          <div className="col-span-3">INVOICE</div>
          <div className="col-span-3">EMAIL ADDRESS</div>
          <div className="col-span-2">DATE CREATED</div>
          <div className="col-span-1">AMOUNT</div>
          <div className="col-span-1">STATUS</div>
          <div className="col-span-2 text-center">ACTIONS</div>
        </div>

        <div className="divide-y">
          {currentInvoices.length > 0 ? (
            currentInvoices.map((invoice, index) => {
              const id = getInvoiceId(invoice);
              const learnerName = getLearnerName(invoice);
              const learnerEmail = getLearnerEmail(invoice);
              const createdAt =
                getStringField(invoice, "dateCreated") ??
                getStringField(invoice, "createdAt") ??
                "";
              const amount =
                getNumberField(invoice, "amount") ??
                (typeof (invoice as any).amount === "string"
                  ? Number((invoice as any).amount)
                  : undefined);
              const status = isRecord(invoice)
                ? (invoice["status"] as unknown)
                : undefined;

              const isDeleting = deletingId === id;
              const isDisabled = loading || Boolean(deletingId);

              return (
                <div
                  key={id || index}
                  className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-all duration-300 group ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="col-span-3 flex items-center space-x-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getLearnerColor(
                        learnerName
                      )}`}
                    >
                      {getLearnerInitials(learnerName)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {learnerName}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center">
                    <span className="text-gray-600">{learnerEmail}</span>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-gray-600">{createdAt}</span>
                  </div>

                  <div className="col-span-1 flex items-center">
                    <span className="font-medium text-gray-900">
                      ${amount?.toLocaleString?.()}
                    </span>
                  </div>

                  <div className="col-span-1 flex items-center">
                    <Badge
                      className={`capitalize ${getStatusBadgeClass(status)}`}
                    >
                      {String(status ?? "")}
                    </Badge>
                  </div>

                  <div className="col-span-2 flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(invoice)}
                      className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
                      aria-label={`Edit invoice for ${learnerName}`}
                      disabled={isDisabled}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(id, learnerName)}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-all duration-300"
                      aria-label={`Delete invoice for ${learnerName}`}
                      disabled={isDisabled || isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No invoices found matching your search criteria.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
                className="text-blue-600 hover:text-blue-700"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-8 w-8 p-0 ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  aria-label={`Page ${i + 1}`}
                  disabled={loading}
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages || loading}
                className="text-blue-600 hover:text-blue-700"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
