"use client";

import React, { useState } from "react";
import {
  Plus,
  Printer,
  Trash2,
  Edit2,
  DollarSign,
  Building,
  CheckCircle,
  FileCheck,
  TrendingDown,
  Calculator,
  Receipt,
} from "lucide-react";

interface ExpenseRegisterViewProps {
  expenses: any[];
  reconciliation: any;
  societyData: any;
  onRefresh: () => void;
  onGenerateVoucher?: (expense: any) => void;
}

export const ExpenseRegisterView: React.FC<ExpenseRegisterViewProps> = ({
  expenses,
  reconciliation,
  societyData,
  onRefresh,
  onGenerateVoucher,
}) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(1); // 1 = April
  const [isAddExpenseModal, setIsAddExpenseModal] = useState(false);
  const [isReconModal, setIsReconModal] = useState(false);

  const [expenseForm, setEditExpenseForm] = useState({
    id: "",
    date: "०१.०४.२०२५",
    description: "",
    voucherNo: "०९",
    cashAmount: "0",
    bankAmount: "0",
    category: "सामान्य खर्च",
  });

  const [reconForm, setReconForm] = useState({
    openingCash: reconciliation?.openingCash || "10828",
    openingBank: reconciliation?.openingBank || "755794",
    monthlyIncomeCash: reconciliation?.monthlyIncomeCash || "49841",
    monthlyIncomeBank: reconciliation?.monthlyIncomeBank || "1900",
    cashDepositedToBank: reconciliation?.cashDepositedToBank || "41400",
  });

  const monthNames = [
    "एप्रिल २०२५ खर्च",
    "मे २०२५ खर्च",
    "जून २०२५ खर्च",
    "जुलै २०२५ खर्च",
    "ऑगस्ट २०२५ खर्च",
    "सप्टेंबर २०२५ खर्च",
    "ऑक्टोबर २०२५ खर्च",
    "नोव्हेंबर २०२५ खर्च",
    "डिसेंबर २०२५ खर्च",
    "जानेवारी २०२६ खर्च",
    "फेब्रुवारी २०२६ खर्च",
    "मार्च २०२६ खर्च",
  ];

  const currentMonthExpenses = expenses.filter((e) => e.monthIndex === selectedMonthIndex);

  // Totals
  const totalCashExpense = currentMonthExpenses.reduce((s, e) => s + Number(e.cashAmount || 0), 0);
  const totalBankExpense = currentMonthExpenses.reduce((s, e) => s + Number(e.bankAmount || 0), 0);

  // Reconciliation Arithmetic
  const openCash = Number(reconForm.openingCash || 10828);
  const openBank = Number(reconForm.openingBank || 755794);
  const incCash = Number(reconForm.monthlyIncomeCash || 49841);
  const incBank = Number(reconForm.monthlyIncomeBank || 1900);
  const cashDep = Number(reconForm.cashDepositedToBank || 41400);

  const totalAvailCash = openCash + incCash; // 60,669
  const totalAvailBank = openBank + incBank; // 7,57,694

  const closingCash = totalAvailCash - totalCashExpense - cashDep; // 6,069
  const closingBank = totalAvailBank - totalBankExpense + cashDep; // 7,22,514

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (expenseForm.id) {
        await fetch(`/api/expenses/${expenseForm.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expenseForm),
        });
      } else {
        await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...expenseForm,
            monthIndex: selectedMonthIndex,
            monthName: monthNames[selectedMonthIndex - 1],
          }),
        });
      }
      setIsAddExpenseModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (confirm("ही खर्च नोंद हटवायची आहे का?")) {
      await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      onRefresh();
    }
  };

  const handleSaveReconciliation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/reconciliation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthIndex: selectedMonthIndex,
          monthName: monthNames[selectedMonthIndex - 1],
          openingCash: openCash,
          openingBank: openBank,
          monthlyIncomeCash: incCash,
          monthlyIncomeBank: incBank,
          cashDepositedToBank: cashDep,
          closingCash,
          closingBank,
        }),
      });
      setIsReconModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <select
            value={selectedMonthIndex}
            onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
            className="p-2 border border-amber-300 rounded-lg text-xs font-bold text-amber-950 bg-amber-50 focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            {monthNames.map((m, idx) => (
              <option key={idx} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500 hidden sm:inline">
            ({currentMonthExpenses.length} खर्चाच्या नोंदी)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditExpenseForm({
                id: "",
                date: "०१.०४.२०२५",
                description: "",
                voucherNo: `०${currentMonthExpenses.length + 1}`,
                cashAmount: "0",
                bankAmount: "0",
                category: "सामान्य खर्च",
              });
              setIsAddExpenseModal(true);
            }}
            className="flex items-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>नवीन खर्च नोंद करा</span>
          </button>

          <button
            onClick={() => setIsReconModal(true)}
            className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-amber-800" />
            <span>रोख/बँक जुळवणी नोंद</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>छपाई / प्रिन्ट</span>
          </button>
        </div>
      </div>

      {/* Main Expense Register Sheet (Exact replica of Image 2 Notebook Page) */}
      <div className="bg-white rounded-2xl border-2 border-slate-800 p-6 shadow-md print:border-none print:p-0 print:shadow-none">
        {/* Header Title */}
        <div className="text-center mb-4 pb-2 border-b-2 border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 font-serif">
            {monthNames[selectedMonthIndex - 1]}
          </h2>
          <p className="text-xs text-slate-600 font-mono">
            {societyData?.name}
          </p>
        </div>

        {/* Expenses Table */}
        <div className="border-2 border-slate-800 rounded-sm overflow-hidden mb-6">
          <table className="w-full text-xs text-left border-collapse font-sans">
            <thead>
              <tr className="bg-amber-100 text-slate-900 font-bold border-b-2 border-slate-800 text-center divide-x-2 divide-slate-800">
                <th className="p-2 min-w-[90px]">दिनांक</th>
                <th className="p-2 min-w-[280px]">खर्चाचा तपशील (Expense Description)</th>
                <th className="p-2 min-w-[60px]">व्हा.क्र.</th>
                <th className="p-2 min-w-[90px]">रोख (₹)</th>
                <th className="p-2 min-w-[100px]">बँक (₹)</th>
                <th className="p-2 min-w-[60px] print:hidden">क्रिया</th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-slate-800 font-mono text-[11px]">
              {currentMonthExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-6 text-slate-500 font-sans italic">
                    या महिन्यात अद्याप कोणतीही खर्चाची नोंद झालेली नाही.
                  </td>
                </tr>
              ) : (
                currentMonthExpenses.map((e) => (
                  <tr key={e.id} className="divide-x-2 divide-slate-800 hover:bg-amber-50/50">
                    <td className="p-2 text-center">{e.date}</td>
                    <td className="p-2 font-sans text-slate-900 font-medium">{e.description}</td>
                    <td className="p-2 text-center font-bold">{e.voucherNo}</td>
                    <td className="p-2 text-right">
                      {Number(e.cashAmount) > 0 ? `₹ ${Number(e.cashAmount).toLocaleString("en-IN")}` : "-"}
                    </td>
                    <td className="p-2 text-right font-bold text-slate-900">
                      {Number(e.bankAmount) > 0 ? `₹ ${Number(e.bankAmount).toLocaleString("en-IN")}` : "-"}
                    </td>
                    <td className="p-2 text-center print:hidden">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setEditExpenseForm({
                              id: e.id,
                              date: e.date,
                              description: e.description,
                              voucherNo: e.voucherNo,
                              cashAmount: e.cashAmount,
                              bankAmount: e.bankAmount,
                              category: e.category || "सामान्य खर्च",
                            });
                            setIsAddExpenseModal(true);
                          }}
                          className="p-1 text-amber-800 hover:bg-amber-100 rounded cursor-pointer"
                          title="संपादित करा"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {onGenerateVoucher && (
                          <button
                            onClick={() => onGenerateVoucher(e)}
                            className="p-1 text-teal-800 hover:bg-teal-100 rounded cursor-pointer"
                            title="व्हाऊचर छापा"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteExpense(e.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded cursor-pointer"
                          title="हटवा"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Expenses Total Footer */}
            <tfoot>
              <tr className="bg-amber-200 text-slate-900 font-bold border-t-2 border-slate-800 divide-x-2 divide-slate-800 text-xs">
                <td colSpan={3} className="p-2 font-sans text-center">
                  एकूण (Total Expenses):
                </td>
                <td className="p-2 text-right font-mono font-bold text-slate-950">
                  ₹ {totalCashExpense.toLocaleString("en-IN")}
                </td>
                <td className="p-2 text-right font-mono font-bold text-slate-950">
                  ₹ {totalBankExpense.toLocaleString("en-IN")}
                </td>
                <td className="p-2 print:hidden"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Cash & Bank Reconciliation Table (Identical to Image 2 Bottom Half) */}
        <div className="max-w-2xl mx-auto border-2 border-slate-800 rounded-sm overflow-hidden bg-slate-50/50 mt-8">
          <div className="bg-slate-800 text-white font-bold text-center py-2 text-xs font-sans tracking-wide">
            शिल्लक व जमा-खर्च जुळवणी (Cash & Bank Reconciliation Sheet)
          </div>

          <table className="w-full text-xs text-left border-collapse font-sans">
            <thead>
              <tr className="bg-amber-100 font-bold text-slate-900 border-b-2 border-slate-800 text-center divide-x-2 divide-slate-800">
                <th className="p-2">विवरण (Particulars)</th>
                <th className="p-2 min-w-[120px]">रोख (Cash ₹)</th>
                <th className="p-2 min-w-[140px]">बँक (Bank ₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y border-b-2 border-slate-800 divide-slate-800 font-mono text-[11px]">
              <tr className="divide-x-2 divide-slate-800">
                <td className="p-2 font-sans font-medium text-slate-800">मागील शिल्लक (Opening Balance)</td>
                <td className="p-2 text-right">{openCash.toLocaleString("en-IN")}</td>
                <td className="p-2 text-right">{openBank.toLocaleString("en-IN")}</td>
              </tr>
              <tr className="divide-x-2 divide-slate-800">
                <td className="p-2 font-sans font-medium text-slate-800">एप्रिल जमा (Monthly Collection)</td>
                <td className="p-2 text-right text-emerald-800 font-semibold">{incCash.toLocaleString("en-IN")}</td>
                <td className="p-2 text-right text-emerald-800 font-semibold">{incBank.toLocaleString("en-IN")}</td>
              </tr>
              <tr className="divide-x-2 divide-slate-800 bg-amber-50/60">
                <td className="p-2 font-sans font-medium text-slate-800">बँकेत रोख जमा (Cash Deposit)</td>
                <td className="p-2 text-right">0</td>
                <td className="p-2 text-right text-blue-800">{cashDep.toLocaleString("en-IN")}</td>
              </tr>
              <tr className="divide-x-2 divide-slate-800 bg-amber-100/60 font-bold">
                <td className="p-2 font-sans text-slate-900">एकूण जमा (Total Available)</td>
                <td className="p-2 text-right text-slate-900">{totalAvailCash.toLocaleString("en-IN")}</td>
                <td className="p-2 text-right text-slate-900">{totalAvailBank.toLocaleString("en-IN")}</td>
              </tr>
              <tr className="divide-x-2 divide-slate-800">
                <td className="p-2 font-sans font-medium text-slate-800">एप्रिल खर्च (Monthly Expenses)</td>
                <td className="p-2 text-right text-amber-900">{totalCashExpense.toLocaleString("en-IN")}</td>
                <td className="p-2 text-right text-amber-900">{totalBankExpense.toLocaleString("en-IN")}</td>
              </tr>
              <tr className="divide-x-2 divide-slate-800 bg-amber-50/60">
                <td className="p-2 font-sans font-medium text-slate-800">बँकेत रोख जमा (Cash Deduction)</td>
                <td className="p-2 text-right text-blue-800">{cashDep.toLocaleString("en-IN")}</td>
                <td className="p-2 text-right">0</td>
              </tr>
            </tbody>

            <tfoot>
              <tr className="bg-amber-300 text-slate-950 font-bold divide-x-2 divide-slate-800 text-xs">
                <td className="p-2 font-sans">एप्रिल अखेर रोख हाती शिल्लक (Closing Balance):</td>
                <td className="p-2 text-right font-mono font-bold text-sm">
                  ₹ {closingCash.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                </td>
                <td className="p-2 text-right font-mono font-bold text-sm">
                  ₹ {closingBank.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Committee Signatures Block (Matching Image 2 Stamp & Signatures) */}
        <div className="mt-10 pt-4 border-t border-slate-300">
          <div className="text-center font-bold text-xs text-slate-800 mb-6 font-serif">
            {societyData?.name}
          </div>

          <div className="grid grid-cols-3 text-center gap-4">
            <div>
              <div className="h-12 border-b border-dashed border-slate-500 max-w-[140px] mx-auto flex items-end justify-center pb-1 text-[11px] text-slate-400">
                (स्वाक्षरी)
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">अध्यक्ष</p>
            </div>
            <div>
              <div className="h-12 border-b border-dashed border-slate-500 max-w-[140px] mx-auto flex items-end justify-center pb-1 text-[11px] text-slate-400">
                (स्वाक्षरी)
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">सेक्रेटरी</p>
            </div>
            <div>
              <div className="h-12 border-b border-dashed border-slate-500 max-w-[140px] mx-auto flex items-end justify-center pb-1 text-xs font-bold text-slate-900">
                {societyData?.treasurerName || "आर. के. मौर्य"}
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">खजिनदार</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isAddExpenseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-amber-200 space-y-4">
            <h3 className="text-lg font-bold text-amber-950">
              {expenseForm.id ? "खर्च नोंद दुरुस्त करा" : "नवीन खर्च नोंदवा"}
            </h3>

            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">दिनांक</label>
                <input
                  type="text"
                  value={expenseForm.date}
                  onChange={(e) => setEditExpenseForm({ ...expenseForm, date: e.target.value })}
                  placeholder="०८.०४.२०२५"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">व्हाऊचर क्रमांक</label>
                <input
                  type="text"
                  value={expenseForm.voucherNo}
                  onChange={(e) => setEditExpenseForm({ ...expenseForm, voucherNo: e.target.value })}
                  placeholder="०१"
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">खर्चाचा तपशील</label>
                <textarea
                  value={expenseForm.description}
                  onChange={(e) => setEditExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="उदा. सोसायटी लिफ्ट रिपेअरिंग खर्च चेक नं. ०५९७३५"
                  className="w-full p-2 border border-slate-300 rounded-lg h-20"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">रोख खर्च (Cash ₹)</label>
                  <input
                    type="number"
                    value={expenseForm.cashAmount}
                    onChange={(e) => setEditExpenseForm({ ...expenseForm, cashAmount: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">बँक खर्च (Bank ₹)</label>
                  <input
                    type="number"
                    value={expenseForm.bankAmount}
                    onChange={(e) => setEditExpenseForm({ ...expenseForm, bankAmount: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg cursor-pointer font-bold"
                >
                  सेव्ह करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Reconciliation Modal */}
      {isReconModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-amber-200 space-y-4">
            <h3 className="text-lg font-bold text-amber-950">रोख व बँक जुळवणी सुधारणा</h3>

            <form onSubmit={handleSaveReconciliation} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">मागील रोख (Opening Cash)</label>
                  <input
                    type="number"
                    value={reconForm.openingCash}
                    onChange={(e) => setReconForm({ ...reconForm, openingCash: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">मागील बँक (Opening Bank)</label>
                  <input
                    type="number"
                    value={reconForm.openingBank}
                    onChange={(e) => setReconForm({ ...reconForm, openingBank: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">चालू महिना जमा रोख</label>
                  <input
                    type="number"
                    value={reconForm.monthlyIncomeCash}
                    onChange={(e) => setReconForm({ ...reconForm, monthlyIncomeCash: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">चालू महिना जमा बँक</label>
                  <input
                    type="number"
                    value={reconForm.monthlyIncomeBank}
                    onChange={(e) => setReconForm({ ...reconForm, monthlyIncomeBank: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">बँकेत जमा केलेली रोख रक्कम (Deposit ₹)</label>
                <input
                  type="number"
                  value={reconForm.cashDepositedToBank}
                  onChange={(e) => setReconForm({ ...reconForm, cashDepositedToBank: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div>अखेर रोख हाती: <span className="font-mono font-bold">₹ {closingCash.toLocaleString()}</span></div>
                <div>अखेर बँक शिल्लक: <span className="font-mono font-bold">₹ {closingBank.toLocaleString()}</span></div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReconModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg cursor-pointer font-bold"
                >
                  अद्ययावत करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
