"use client";

import React, { useState } from "react";
import { Search, Printer, Receipt, DollarSign, CheckCircle2, Building } from "lucide-react";

interface ReceiptGeneratorViewProps {
  bills: any[];
  expenses: any[];
  societyData: any;
  onSelectReceipt: (receipt: any) => void;
  onSelectVoucher: (voucher: any) => void;
}

export const ReceiptGeneratorView: React.FC<ReceiptGeneratorViewProps> = ({
  bills,
  expenses,
  societyData,
  onSelectReceipt,
  onSelectVoucher,
}) => {
  const [activeSubTab, setActiveTab] = useState<"receipts" | "vouchers">("receipts");
  const [searchQuery, setSearchQuery] = useState("");

  // Paid bills with receipts
  const paidBills = bills
    .filter((b) => Number(b.bill.amountPaid || 0) > 0)
    .filter(
      (b) =>
        b.flat.flatNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.flat.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.bill.receiptNo && b.bill.receiptNo.includes(searchQuery))
    );

  const filteredExpenses = expenses.filter(
    (e) =>
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.voucherNo.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Search & Selector Header */}
      <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("receipts")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "receipts"
                ? "bg-amber-800 text-white shadow-xs"
                : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>जमा पावत्या (Maintenance Receipts)</span>
          </button>

          <button
            onClick={() => setActiveTab("vouchers")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "vouchers"
                ? "bg-amber-800 text-white shadow-xs"
                : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>खर्च व्हाऊचर (Expense Vouchers)</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="शोधा (पावती/फ्लॅट क्र/नाव)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Receipts Grid */}
      {activeSubTab === "receipts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paidBills.length === 0 ? (
            <div className="col-span-full bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-xs font-medium">
              कोणतीही पावती सापडली नाही.
            </div>
          ) : (
            paidBills.map((item) => {
              const b = item.bill;
              const f = item.flat;

              return (
                <div
                  key={b.id}
                  className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm hover:shadow-md transition-shadow space-y-3"
                >
                  <div className="flex justify-between items-start border-b border-amber-100 pb-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-mono">पावती क्रमांक</span>
                      <span className="font-bold font-mono text-sm text-amber-900">
                        #{b.receiptNo || "२९५३"}
                      </span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {b.paymentDate || "०६.०४.२०२५"}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{f.memberName}</h4>
                    <p className="text-[11px] text-slate-500">
                      फ्लॅट क्र: <span className="font-bold text-slate-700">{f.flatNo}</span> | महिना: <span className="font-bold text-slate-700">{b.monthName}</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center bg-amber-50 p-2 rounded-lg font-mono text-xs">
                    <span className="font-sans text-[11px] font-semibold text-amber-900">जमा रक्कम:</span>
                    <span className="font-bold text-amber-950">₹ {Number(b.amountPaid).toLocaleString("en-IN")}/-</span>
                  </div>

                  <button
                    onClick={() =>
                      onSelectReceipt({
                        receiptNo: b.receiptNo || "२९५३",
                        flatNo: f.flatNo,
                        memberName: f.memberName,
                        monthName: b.monthName,
                        date: b.paymentDate || "०६.०४.२०२५",
                        amount: Number(b.amountPaid),
                        paymentMode: b.paymentMode || "cash",
                        serviceCharge: Number(b.serviceCharge),
                        propertyTax: Number(b.propertyTax),
                        waterCharge: Number(b.waterCharge),
                        arrearsInterest: Number(b.arrearsInterest),
                        arrearsBalance: Number(b.arrearsBalance),
                      })
                    }
                    className="w-full py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>पावती उघडा व छापा</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Vouchers Grid */}
      {activeSubTab === "vouchers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExpenses.length === 0 ? (
            <div className="col-span-full bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-xs font-medium">
              कोणतेही व्हाऊचर सापडले नाही.
            </div>
          ) : (
            filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-mono">व्हाऊचर क्रमांक</span>
                    <span className="font-bold font-mono text-sm text-slate-900">#{exp.voucherNo}</span>
                  </div>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {exp.date}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-800 line-clamp-2 h-8">
                  {exp.description}
                </p>

                <div className="flex justify-between items-center bg-slate-100 p-2 rounded-lg font-mono text-xs">
                  <span className="font-sans text-[11px] font-semibold text-slate-700">एकूण खर्च:</span>
                  <span className="font-bold text-slate-900">
                    ₹ {(Number(exp.cashAmount || 0) + Number(exp.bankAmount || 0)).toLocaleString("en-IN")}/-
                  </span>
                </div>

                <button
                  onClick={() =>
                    onSelectVoucher({
                      voucherNo: exp.voucherNo,
                      date: exp.date,
                      description: exp.description,
                      cashAmount: Number(exp.cashAmount || 0),
                      bankAmount: Number(exp.bankAmount || 0),
                      category: exp.category,
                    })
                  }
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>व्हाऊचर उघडा व छापा</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
