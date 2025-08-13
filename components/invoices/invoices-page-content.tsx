/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { getLearners } from "@/lib/api/learners";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvoicesPageContent() {
  // Invoices state
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Learners state
  const [availableLearners, setAvailableLearners] = useState<
    { id: string; name: string; email: string }[]
  >([]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Loading state
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch invoices
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

  // Fetch learners
  useEffect(() => {
    getLearners()
      .then((data) => {
        const mapped = data.map((learner: any) => ({
          id: learner.id || learner._id,
          name: `${learner.firstName ?? learner.first_name ?? ""} ${
            learner.lastName ?? learner.last_name ?? ""
          }`.trim(),
          email: learner.email,
        }));
        setAvailableLearners(mapped);
      })
      .catch((err: any) => {
        console.error("fetch learners failed", err?.response?.data ?? err);
        toast.error("Failed to load learners");
      });
  }, []);

  // Search filter
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

  // Handlers
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

  // Skeleton table while loading
  const TableSkeleton = () => (
    <div className="w-full border rounded-md">
      <div className="grid grid-cols-5 border-b bg-gray-50 p-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
      {[...Array(6)].map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-5 border-b p-3 items-center"
        >
          {[...Array(5)].map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-20" />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
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

        {/* Table */}
        {loading && !isLoaded ? (
          <TableSkeleton />
        ) : (
          <InvoicesTable
            invoices={filteredInvoices}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        )}

        {/* Add Invoice Modal */}
        <AddInvoiceModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onCreated={handleCreate}
          availableLearners={availableLearners} // only learners
        />

        {/* Edit Invoice Modal */}
        {editingInvoice && (
          <EditInvoiceModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingInvoice(null);
            }}
            onUpdated={handleUpdated}
            invoice={editingInvoice}
            availableLearners={availableLearners} // only learners
          />
        )}
      </div>
    </DashboardLayout>
  );
}
