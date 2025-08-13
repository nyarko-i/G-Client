/* eslint-disable @typescript-eslint/no-explicit-any */
/* components/invoices/add-invoice-modal.tsx */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createInvoice, CreateInvoicePayload } from "@/lib/api/invoices";
import { toast } from "sonner";

interface LearnerOption {
  id: string;
  name: string;
  email: string;
}

interface AddInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (invoice: any) => void;
  availableLearners: LearnerOption[];
}

export default function AddInvoiceModal({
  open,
  onClose,
  onCreated,
  availableLearners,
}: AddInvoiceModalProps) {
  const [formData, setFormData] = useState({
    learnerId: "",
    amount: "",
    dueDate: "",
    status: "pending" as "pending" | "paid" | "overdue",
    paymentDetails: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectLearner = (value: string) => {
    setFormData((prev) => ({ ...prev, learnerId: value }));
  };

  const handleSelectStatus = (value: "pending" | "paid" | "overdue") => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.learnerId) {
      toast.error("Please select a learner.");
      return;
    }

    const amountNum = Number(formData.amount);
    if (!formData.amount || isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      const payload: CreateInvoicePayload = {
        learner: formData.learnerId,
        amount: amountNum,
        status: formData.status,
        paystackCallbackUrl: "http://localhost:3000/payment",
      };

      if (formData.dueDate) payload.dueDate = formData.dueDate;
      if (formData.paymentDetails.trim())
        payload.paymentDetails = formData.paymentDetails.trim();

      const createdInvoice = await createInvoice(payload);

      toast.success("Invoice created successfully");

      onCreated(createdInvoice);

      setFormData({
        learnerId: "",
        amount: "",
        dueDate: "",
        status: "pending",
        paymentDetails: "",
      });

      onClose();
    } catch (err: any) {
      console.error("Create invoice failed:", err);
      toast.error(err?.message ?? "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Learner */}
          <Select
            value={formData.learnerId}
            onValueChange={handleSelectLearner}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Learner" />
            </SelectTrigger>
            <SelectContent>
              {availableLearners.map((learner) => (
                <SelectItem key={learner.id} value={learner.id}>
                  {learner.name} ({learner.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Amount */}
          <Input
            name="amount"
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
          />

          {/* Due Date */}
          <Input
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
          />

          {/* Status */}
          <Select value={formData.status} onValueChange={handleSelectStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Details */}
          <Input
            name="paymentDetails"
            placeholder="Payment Details"
            value={formData.paymentDetails}
            onChange={handleChange}
          />

          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
