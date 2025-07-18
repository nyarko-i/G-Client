"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoiceData {
  id: string;
  name: string;
  email: string;
  amount: number;
  avatar: string;
}

const invoicesData: InvoiceData[] = [
  {
    id: "1",
    name: "James Anderson",
    email: "james@example.com",
    amount: 320,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Michael Johnson",
    email: "michael@example.com",
    amount: 270,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "David Brown",
    email: "david@example.com",
    amount: 315,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Olivia Davis",
    email: "olivia@example.com",
    amount: 400,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Chris Evans",
    email: "chris@example.com",
    amount: 410,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "Emma Wilson",
    email: "emma@example.com",
    amount: 380,
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

function InvoiceItem({ invoice }: { invoice: InvoiceData }) {
  return (
    <div className="flex items-center justify-between py-3 px-2 rounded-lg cursor-pointer hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {invoice.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{invoice.name}</p>
          <p className="text-xs text-gray-500">{invoice.email}</p>
        </div>
      </div>
      <div className="text-sm font-semibold text-gray-900">
        ${invoice.amount}
      </div>
    </div>
  );
}

export default function LatestInvoices() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Latest Invoice
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between py-2 border-b border-gray-100 mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Amount
          </span>
        </div>

        {/* ✅ Scrollable invoice list */}
        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
          {invoicesData.map((invoice) => (
            <InvoiceItem key={invoice.id} invoice={invoice} />
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">
            View all invoices
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
