/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateInvoice } from "@/lib/api/invoices";
import type { Invoice } from "@/lib/types/invoice";
import type { UpdateInvoicePayload } from "@/lib/api/invoices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EditInvoiceModalProps {
  isOpen: boolean;
  invoice: Invoice;
  onClose: () => void;
  onUpdated: (updatedInvoice: Invoice) => void;
  availableLearners?: { id: string; name: string; email: string }[];
}

export default function EditInvoiceModal({
  isOpen,
  invoice,
  onClose,
  onUpdated,
}: EditInvoiceModalProps) {
  const [formData, setFormData] = useState<UpdateInvoicePayload>({
    amount: invoice.amount,
    dueDate: invoice.dueDate,
    status: invoice.status,
    paymentDetails: invoice.paymentDetails,
  });
  const [loading, setLoading] = useState(false);

  // keep form in sync when invoice prop changes
  useEffect(() => {
    setFormData({
      amount: invoice.amount,
      dueDate: invoice.dueDate,
      status: invoice.status,
      paymentDetails: invoice.paymentDetails,
    });
  }, [invoice]);

  const handleChange = (field: keyof UpdateInvoicePayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log("Updating invoice:", invoice.id, "payload:", formData);
      const updated = await updateInvoice(invoice.id, formData);
      console.log("updateInvoice returned:", updated);
      toast.success("Invoice updated");
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      console.error("update invoice failed", err?.response?.data ?? err);
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Failed to update invoice";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Amount"
            value={formData.amount ?? ""}
            onChange={(e) => handleChange("amount", Number(e.target.value))}
          />
          <Input
            type="date"
            value={formData.dueDate ?? ""}
            onChange={(e) => handleChange("dueDate", e.target.value)}
          />
          <Input
            placeholder="Status"
            value={formData.status ?? ""}
            onChange={(e) => handleChange("status", e.target.value as any)}
          />
          <Input
            placeholder="Payment Details"
            value={formData.paymentDetails ?? ""}
            onChange={(e) => handleChange("paymentDetails", e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
