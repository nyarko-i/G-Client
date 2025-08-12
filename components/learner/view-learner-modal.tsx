"use client";

import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Learner } from "@/lib/types/learner";

interface ViewLearnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  learner: Learner | null;
}

export default function ViewLearnerModal({
  isOpen,
  onClose,
  learner,
}: ViewLearnerModalProps) {
  if (!learner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 overflow-hidden rounded-2xl border-none shadow-lg">
        <div className="flex flex-col items-center px-6 py-6">
          {/* Avatar */}
          <div className="h-28 w-28 rounded-full overflow-hidden shadow-md border border-gray-200 mb-4">
            <Image
              src={
                learner.avatar ||
                "/placeholder.svg?height=112&width=112&text=Learner"
              }
              alt={learner.name}
              width={112}
              height={112}
              className="object-cover"
            />
          </div>

          {/* Name & Email */}
          <h3 className="text-xl font-bold text-gray-900">{learner.name}</h3>
          <p className="text-sm text-gray-500">{learner.email}</p>

          {/* Details Card */}
          <div className="bg-gray-50 rounded-xl w-full mt-6 p-4 space-y-3 text-sm">
            <DetailRow label="Program" value={learner.program || "N/A"} />
            <DetailRow label="Gender" value={learner.gender || "N/A"} />
            <DetailRow label="Contact" value={learner.contact || "N/A"} />
            <DetailRow label="Location" value={learner.country || "N/A"} />
            <DetailRow label="Paid" value={learner.paidStatus || "N/A"} />
            <DetailRow
              label="Bio"
              value={learner.description || "No bio available."}
              multiline
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div
      className={`${
        multiline ? "flex flex-col" : "flex justify-between"
      } gap-1`}
    >
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
