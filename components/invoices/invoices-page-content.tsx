/* eslint-disable @typescript-eslint/no-explicit-any */
/* components/invoices/invoices-page-content.tsx */
"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import InvoicesTable from "./invoice-table";
import AddInvoiceModal from "./add-invoice-modal";
import EditInvoiceModal from "./edit-invoice-modal";
import type { Invoice } from "@/lib/types/invoice";
import { fetchInvoices, deleteInvoice } from "@/lib/api/invoices";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const availableLearners = [
  {
    id: "67f792c7338e633d391bfe0a",
    name: "Passum Tornado",
    email: "guevel@hearkn.com",
  },
];

export default function InvoicesPageContent() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true); // Start as loading
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchInvoices()
      .then((list) => {
        setInvoices(list);
        setFilteredInvoices(list);
      })
      .catch((err: any) => {
        console.error("fetch invoices failed", err?.response?.data ?? err);
        toast.error("Failed to load invoices");
      })
      .finally(() => {
        setLoading(false);
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    const filtered = invoices.filter((invoice) => {
      const term = searchTerm.toLowerCase();
      return (
        invoice.learnerName?.toLowerCase().includes(term) ||
        invoice.learnerEmail?.toLowerCase().includes(term) ||
        (typeof invoice.status === "string" &&
          invoice.status.toLowerCase().includes(term))
      );
    });
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  const handleCreate = (createdInvoice: Invoice) => {
    setInvoices((prev) => [...prev, createdInvoice]);
    toast.success("Invoice added");
  };

  const handleOpenEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleUpdated = (updatedInvoice: Invoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
    );
    toast.success("Invoice updated");
  };

  const handleDelete = async (invoiceId: string) => {
    setLoading(true);
    try {
      await deleteInvoice(invoiceId);
      setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
      toast.success("Invoice deleted");
    } catch (err: any) {
      console.error("delete failed", err?.response?.data ?? err);
      toast.error("Failed to delete invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {loading && !isLoaded ? (
          <>
            {/* Skeleton for header */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Skeleton for search */}
            <Skeleton className="h-10 w-full max-w-md" />

            {/* Skeleton table rows */}
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div
              className={`flex items-center justify-between transition-all duration-700 ease-out ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Manage Invoices
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Filter, sort, and access detailed invoices
                </p>
              </div>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Invoice
              </Button>
            </div>

            {/* Search */}
            <div
              className={`transition-all duration-700 ease-out delay-100 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search invoice"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Table */}
            <div
              className={`transition-all duration-700 ease-out delay-200 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <InvoicesTable
                invoices={filteredInvoices}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                loading={loading}
              />
            </div>

            {/* Modals */}
            <AddInvoiceModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onCreated={handleCreate}
              availableLearners={availableLearners}
            />

            {editingInvoice && (
              <EditInvoiceModal
                isOpen={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setEditingInvoice(null);
                }}
                onUpdated={handleUpdated}
                invoice={editingInvoice}
                availableLearners={availableLearners}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
