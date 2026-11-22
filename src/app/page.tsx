"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { BalanceSheetView } from "@/components/BalanceSheetView";
import { MaintenanceLedgerView } from "@/components/MaintenanceLedgerView";
import { ExpenseRegisterView } from "@/components/ExpenseRegisterView";
import { DocumentScannerView } from "@/components/DocumentScannerView";
import { ReceiptGeneratorView } from "@/components/ReceiptGeneratorView";
import { FlatsDirectoryView } from "@/components/FlatsDirectoryView";
import { SocietySettingsView } from "@/components/SocietySettingsView";
import { PrintableReceiptModal } from "@/components/PrintableReceiptModal";
import { PrintableVoucherModal } from "@/components/PrintableVoucherModal";
import { RefreshCw, BookOpen, FileText, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>("balance-sheet");
  const [loading, setLoading] = useState<boolean>(true);

  const [societyData, setSocietyData] = useState<any>(null);
  const [flats, setFlats] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [reconciliation, setReconciliation] = useState<any>(null);
  const [balanceSheetData, setBalanceSheetData] = useState<any>({ liabilities: [], assets: [] });

  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  const loadAllData = async () => {
    try {
      // Ensure database is seeded
      await fetch("/api/init");

      const [socRes, flatsRes, billsRes, expRes, reconRes, bsRes] = await Promise.all([
        fetch("/api/society"),
        fetch("/api/flats"),
        fetch("/api/bills"),
        fetch("/api/expenses"),
        fetch("/api/reconciliation?monthIndex=1"),
        fetch("/api/balance-sheet"),
      ]);

      if (socRes.ok) setSocietyData(await socRes.json());
      if (flatsRes.ok) setFlats(await flatsRes.json());
      if (billsRes.ok) setBills(await billsRes.json());
      if (expRes.ok) setExpenses(await expRes.json());
      if (reconRes.ok) setReconciliation(await reconRes.json());
      if (bsRes.ok) setBalanceSheetData(await bsRes.json());
    } catch (err) {
      console.error("Error loading application data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleRecalculateAll = async () => {
    setIsRecalculating(true);
    try {
      await fetch("/api/bills/recalculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      await loadAllData();
    } catch (err) {
      console.error("Recalculation error:", err);
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleGenerateReceiptFromBill = (bill: any, flat: any) => {
    setSelectedReceipt({
      receiptNo: bill.receiptNo || "२९५३",
      flatNo: flat.flatNo,
      memberName: flat.memberName,
      monthName: bill.monthName,
      date: bill.paymentDate || "०६.०४.२०२५",
      amount: Number(bill.amountPaid || bill.totalDue),
      paymentMode: bill.paymentMode || "cash",
      serviceCharge: Number(bill.serviceCharge),
      propertyTax: Number(bill.propertyTax),
      waterCharge: Number(bill.waterCharge),
      arrearsInterest: Number(bill.arrearsInterest),
      arrearsBalance: Number(bill.arrearsBalance),
    });
  };

  const handleGenerateVoucherFromExpense = (expense: any) => {
    setSelectedVoucher({
      voucherNo: expense.voucherNo,
      date: expense.date,
      description: expense.description,
      cashAmount: Number(expense.cashAmount || 0),
      bankAmount: Number(expense.bankAmount || 0),
      category: expense.category,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/40 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-amber-200 text-center space-y-4 max-w-sm w-full">
          <div className="w-14 h-14 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center mx-auto border border-amber-300">
            <RefreshCw className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h2 className="text-base font-bold text-amber-950 font-serif">
              सोसायटी दप्तर डेटा लोड होत आहे...
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              श्री सद्गुरुकृपा सहकारा गृहनिर्माण संस्था मर्यादित
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-amber-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        societyData={societyData}
        onRefreshData={loadAllData}
        isRecalculating={isRecalculating}
        onRecalculateAll={handleRecalculateAll}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {activeTab === "balance-sheet" && (
          <BalanceSheetView
            balanceSheetData={balanceSheetData}
            societyData={societyData}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === "maintenance-ledger" && (
          <MaintenanceLedgerView
            flats={flats}
            bills={bills}
            societyData={societyData}
            onRefresh={loadAllData}
            onGenerateReceipt={handleGenerateReceiptFromBill}
          />
        )}

        {activeTab === "expense-register" && (
          <ExpenseRegisterView
            expenses={expenses}
            reconciliation={reconciliation}
            societyData={societyData}
            onRefresh={loadAllData}
            onGenerateVoucher={handleGenerateVoucherFromExpense}
          />
        )}

        {activeTab === "scanner" && (
          <DocumentScannerView onRefresh={loadAllData} />
        )}

        {activeTab === "receipts" && (
          <ReceiptGeneratorView
            bills={bills}
            expenses={expenses}
            societyData={societyData}
            onSelectReceipt={setSelectedReceipt}
            onSelectVoucher={setSelectedVoucher}
          />
        )}

        {activeTab === "flats" && (
          <FlatsDirectoryView flats={flats} onRefresh={loadAllData} />
        )}

        {activeTab === "settings" && (
          <SocietySettingsView societyData={societyData} onRefresh={loadAllData} />
        )}
      </main>

      {/* Print Modals */}
      <PrintableReceiptModal
        receiptData={selectedReceipt}
        societyData={societyData}
        onClose={() => setSelectedReceipt(null)}
      />

      <PrintableVoucherModal
        voucherData={selectedVoucher}
        societyData={societyData}
        onClose={() => setSelectedVoucher(null)}
      />

      {/* Printable Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © २०२५-२०२६ {societyData?.name || "सोसायटी"} | डिजिटल दप्तर व ताळेबंद व्यवस्थापन सिस्टीम
          </div>
          <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>महाराष्ट्र सहकारी संस्था नियम १९६० नुसार डिजिटल रजिस्टर</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
