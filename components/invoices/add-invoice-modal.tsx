/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { toast } from "sonner";

import type { Invoice } from "@/lib/types/invoice";
import { createInvoice, type CreateInvoicePayload } from "@/lib/api/invoices";

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (invoice: Invoice) => void;
  availableLearners: { id: string; name: string; email: string }[];
}

export default function AddInvoiceModal({
  isOpen,
  onClose,
  onCreated,
  availableLearners,
}: AddInvoiceModalProps) {
  const [formData, setFormData] = useState({
    learnerId: "",
    amount: "",
    dueDate: "",
    paymentDetails: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.learnerId) {
      toast.error("Please select a learner.");
      return;
    }

    // If paymentDetails is present, require at least 10 characters
    const paymentDetailsTrim = formData.paymentDetails?.trim() ?? "";
    if (paymentDetailsTrim && paymentDetailsTrim.length < 10) {
      toast.error("Payment details must be at least 10 characters.");
      return;
    }

    setLoading(true);
    try {
      const payload: CreateInvoicePayload = {
        learner: formData.learnerId,
        paystackCallbackUrl: "http://localhost:3000/payment",
      };

      const amountNum = Number(formData.amount);
      if (formData.amount && !isNaN(amountNum) && amountNum > 0) {
        payload.amount = amountNum;
      }

      if (formData.dueDate) payload.dueDate = formData.dueDate;
      if (paymentDetailsTrim) payload.paymentDetails = paymentDetailsTrim;

      console.log("Creating invoice payload:", payload);

      const createdInvoice = await createInvoice(payload);
      console.log("createInvoice returned:", createdInvoice);

      toast.success("Invoice created successfully");
      onCreated(createdInvoice);

      setFormData({
        learnerId: "",
        amount: "",
        dueDate: "",
        paymentDetails: "",
      });

      onClose();
    } catch (err: any) {
      console.error("Create invoice failed:", err);
      const msg = err?.message ?? "Failed to create invoice";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Invoice
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Learner select */}
          <div className="space-y-2">
            <Label htmlFor="learner">Select learner</Label>
            <Select
              value={formData.learnerId}
              onValueChange={(value) => handleSelectChange("learnerId", value)}
            >
              <SelectTrigger id="learner">
                <SelectValue placeholder="Select a learner" />
              </SelectTrigger>
              <SelectContent>
                {availableLearners.map((learner) => (
                  <SelectItem key={learner.id} value={learner.id}>
                    {learner.name} ({learner.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (optional)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              min={0}
              step="any"
            />
          </div>

          {/* Due date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due date (optional)</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </div>

          {/* Payment details */}
          <div className="space-y-2">
            <Label htmlFor="paymentDetails">Payment details (optional)</Label>
            <Textarea
              id="paymentDetails"
              name="paymentDetails"
              value={formData.paymentDetails}
              onChange={handleInputChange}
              placeholder="Add any payment notes or details"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
