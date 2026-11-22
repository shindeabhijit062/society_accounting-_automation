"use client";

import React, { useState } from "react";
import {
  Search,
  Printer,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

interface MaintenanceLedgerViewProps {
  flats: any[];
  bills: any[];
  societyData: any;
  onRefresh: () => void;
  onGenerateReceipt?: (billData: any, flatData: any) => void;
}

export const MaintenanceLedgerView: React.FC<MaintenanceLedgerViewProps> = ({
  flats,
  bills,
  societyData,
  onRefresh,
  onGenerateReceipt,
}) => {
  const [selectedFlatId, setSelectedFlatId] = useState<string>(flats[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingBillId, setEditingBillId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  // Filter flats by search
  const filteredFlats = flats.filter(
    (f) =>
      f.flatNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.memberName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentFlat = flats.find((f) => f.id === selectedFlatId) || flats[0];
  const flatIndex = flats.findIndex((f) => f.id === selectedFlatId);

  // Get 12 months bills for current flat
  const flatBills = bills
    .filter((b) => b.bill.flatId === (currentFlat?.id || selectedFlatId))
    .map((b) => b.bill)
    .sort((a, b) => a.monthIndex - b.monthIndex);

  // Totals for current flat
  const totalServiceCharge = flatBills.reduce((s, b) => s + Number(b.serviceCharge || 0), 0);
  const totalPropertyTax = flatBills.reduce((s, b) => s + Number(b.propertyTax || 0), 0);
  const totalWaterCharge = flatBills.reduce((s, b) => s + Number(b.waterCharge || 0), 0);
  const totalFestivalFee = flatBills.reduce((s, b) => s + Number(b.festivalFee || 0), 0);
  const totalOtherCharges = flatBills.reduce((s, b) => s + Number(b.otherCharges || 0), 0);
  const totalInterest = flatBills.reduce((s, b) => s + Number(b.arrearsInterest || 0), 0);
  const totalPaid = flatBills.reduce((s, b) => s + Number(b.amountPaid || 0), 0);
  const lastRemaining = flatBills[flatBills.length - 1]?.remainingBalance || 0;

  const startEdit = (b: any) => {
    setEditingBillId(b.id);
    setEditForm({ ...b });
  };

  const handleSaveBill = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/bills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      // Recalculate rolling interest for this flat
      await fetch("/api/bills/recalculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flatId: currentFlat.id }),
      });

      setEditingBillId(null);
      onRefresh();
    } catch (err) {
      console.error("Failed to update bill", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Search and Flat Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="फ्लॅट क्र. / नाव शोधा..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                if (flatIndex > 0) setSelectedFlatId(flats[flatIndex - 1].id);
              }}
              disabled={flatIndex <= 0}
              className="p-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold font-mono px-2 text-slate-800">
              {flatIndex + 1} / {flats.length}
            </span>
            <button
              onClick={() => {
                if (flatIndex < flats.length - 1) setSelectedFlatId(flats[flatIndex + 1].id);
              }}
              disabled={flatIndex >= flats.length - 1}
              className="p-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Flat Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
          {filteredFlats.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFlatId(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                selectedFlatId === f.id
                  ? "bg-amber-800 text-white border-amber-900 shadow-xs"
                  : "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
              }`}
            >
              फ्लॅट {f.flatNo} ({f.memberName.split(" ")[0]})
            </button>
          ))}
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>रजिस्टर प्रिन्ट</span>
        </button>
      </div>

      {/* Notebook Register Page Container */}
      <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-lg p-4 md:p-6 print:border-none print:p-0 print:shadow-none">
        {/* Register Top Metadata Box (Identical to Image 1 & 3 Notebook Header) */}
        <div className="border-2 border-slate-800 mb-4 bg-amber-50/30">
          <div className="text-center font-bold py-1.5 border-b-2 border-slate-800 text-sm bg-amber-100/60 font-mono tracking-wide">
            सन {societyData?.financialYear || "२०२५ - २०२६"}
          </div>

          <div className="grid grid-cols-12 text-xs divide-x-2 divide-slate-800 border-b-2 border-slate-800">
            <div className="col-span-1 p-2 text-center font-bold">
              <span className="block text-[10px] text-slate-500">अ.क्र.</span>
              <span className="font-mono text-sm">{String(currentFlat?.srNo || 1).padStart(2, "0")}</span>
            </div>
            <div className="col-span-2 p-2 text-center font-bold">
              <span className="block text-[10px] text-slate-500">फ्लॅट क्र.</span>
              <span className="font-mono text-base text-amber-900">{currentFlat?.flatNo}</span>
            </div>
            <div className="col-span-6 p-2 font-bold text-left">
              <span className="block text-[10px] text-slate-500">सदनिकारकाचे नाव</span>
              <span className="text-sm text-slate-900">{currentFlat?.memberName}</span>
              {currentFlat?.notes && (
                <span className="block text-[11px] font-normal text-slate-600">टीप/मालक: {currentFlat.notes}</span>
              )}
            </div>
            <div className="col-span-3 p-2 text-center font-bold">
              <span className="block text-[10px] text-slate-500">क्षेत्रफळ (sq.ft)</span>
              <span className="font-mono text-sm">{currentFlat?.areaSqft || 225}</span>
            </div>
          </div>

          {/* Transfer details row */}
          <div className="grid grid-cols-12 text-xs divide-x-2 divide-slate-800 bg-amber-50/20">
            <div className="col-span-6 p-1.5 font-bold text-slate-700 text-center">
              हस्तांतरण तपशील (Transfer Details)
            </div>
            <div className="col-span-2 p-1.5 text-center font-mono">
              <span className="text-[10px] block text-slate-500">दिनांक</span>
              <span>{currentFlat?.transferDate || "-"}</span>
            </div>
            <div className="col-span-2 p-1.5 text-center font-mono">
              <span className="text-[10px] block text-slate-500">हस्तांतरण शुल्क</span>
              <span>₹ {currentFlat?.transferFee || "0"}</span>
            </div>
            <div className="col-span-2 p-1.5 text-center font-mono">
              <span className="text-[10px] block text-slate-500">प्रवेश फी</span>
              <span>₹ {currentFlat?.entranceFee || "0"}</span>
            </div>
          </div>
        </div>

        {/* 12-Month Maintenance Table (Exact replica of notebook columns) */}
        <div className="overflow-x-auto border-2 border-slate-800 rounded-sm">
          <table className="w-full text-xs text-left border-collapse font-sans">
            <thead>
              {/* Header row 1 */}
              <tr className="bg-amber-100 text-slate-900 border-b-2 border-slate-800 text-[11px] font-bold text-center divide-x-2 divide-slate-800">
                <th className="p-2 min-w-[60px]" rowSpan={2}>महिना</th>
                <th className="p-2 min-w-[50px]" rowSpan={2}>देयक क्र.</th>
                <th className="p-2 min-w-[80px]" rowSpan={2}>देयक दिनांक</th>
                <th className="p-2 min-w-[65px]">सेवाशुल्क</th>
                <th className="p-2 min-w-[65px]">मालमत्ता कर</th>
                <th className="p-2 min-w-[65px]">पाणी शुल्क</th>
                <th className="p-2 min-w-[55px]">उत्सव शुल्क</th>
                <th className="p-2 min-w-[55px]">इतर</th>
                <th className="p-2 min-w-[70px]">थकबाकी व्याज</th>
                <th className="p-2 min-w-[75px]">थकबाकी</th>
                <th className="p-2 min-w-[80px] bg-amber-200" rowSpan={2}>एकूण येणे (₹)</th>
                <th className="p-2 bg-amber-200/80" colSpan={4}>वसुली (Collection / Receipts)</th>
                <th className="p-2 min-w-[60px] print:hidden" rowSpan={2}>क्रिया</th>
              </tr>
              {/* Header row 2 */}
              <tr className="bg-amber-100 text-slate-900 border-b-2 border-slate-800 text-[10px] font-bold text-center divide-x-2 divide-slate-800">
                <th className="p-1">₹ ४००</th>
                <th className="p-1">कर</th>
                <th className="p-1">पाणी</th>
                <th className="p-1">उत्सव</th>
                <th className="p-1">इतर</th>
                <th className="p-1 text-amber-900">२१%</th>
                <th className="p-1">मागील</th>
                <th className="p-1 min-w-[60px]">पावती क्र.</th>
                <th className="p-1 min-w-[75px]">दिनांक</th>
                <th className="p-1 min-w-[75px]">जमा (₹)</th>
                <th className="p-1 min-w-[75px] bg-amber-200">बाकी (₹)</th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-slate-800 font-mono text-[11px]">
              {flatBills.map((b) => {
                const isEditing = editingBillId === b.id;
                const isPaid = Number(b.amountPaid || 0) >= Number(b.totalDue || 0) && Number(b.totalDue) > 0;
                const isPartial = Number(b.amountPaid) > 0 && Number(b.amountPaid) < Number(b.totalDue);

                return (
                  <tr
                    key={b.id}
                    className={`divide-x-2 divide-slate-800 hover:bg-amber-50/70 transition-colors ${
                      isPaid ? "bg-emerald-50/30" : isPartial ? "bg-amber-50/50" : ""
                    }`}
                  >
                    {/* Month Name */}
                    <td className="p-1.5 font-sans font-bold text-slate-900 text-center bg-amber-50/40">
                      {b.monthName}
                    </td>

                    {/* Bill No */}
                    <td className="p-1.5 text-center font-bold">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.billNo}
                          onChange={(e) => setEditForm({ ...editForm, billNo: e.target.value })}
                          className="w-full text-center border rounded bg-white p-0.5"
                        />
                      ) : (
                        b.billNo
                      )}
                    </td>

                    {/* Bill Date */}
                    <td className="p-1.5 text-center text-[10px]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.billDate}
                          onChange={(e) => setEditForm({ ...editForm, billDate: e.target.value })}
                          className="w-full text-center border rounded bg-white p-0.5"
                        />
                      ) : (
                        b.billDate
                      )}
                    </td>

                    {/* Service Charge */}
                    <td className="p-1.5 text-right font-semibold">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.serviceCharge}
                          onChange={(e) => setEditForm({ ...editForm, serviceCharge: e.target.value })}
                          className="w-full text-right border rounded bg-white p-0.5"
                        />
                      ) : (
                        b.serviceCharge
                      )}
                    </td>

                    {/* Property Tax */}
                    <td className="p-1.5 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.propertyTax}
                          onChange={(e) => setEditForm({ ...editForm, propertyTax: e.target.value })}
                          className="w-full text-right border rounded bg-white p-0.5"
                        />
                      ) : Number(b.propertyTax) > 0 ? (
                        b.propertyTax
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Water Charge */}
                    <td className="p-1.5 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.waterCharge}
                          onChange={(e) => setEditForm({ ...editForm, waterCharge: e.target.value })}
                          className="w-full text-right border rounded bg-white p-0.5"
                        />
                      ) : Number(b.waterCharge) > 0 ? (
                        b.waterCharge
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Festival Fee */}
                    <td className="p-1.5 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.festivalFee}
                          onChange={(e) => setEditForm({ ...editForm, festivalFee: e.target.value })}
                          className="w-full text-right border rounded bg-white p-0.5"
                        />
                      ) : Number(b.festivalFee) > 0 ? (
                        b.festivalFee
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Other Charges */}
                    <td className="p-1.5 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.otherCharges}
                          onChange={(e) => setEditForm({ ...editForm, otherCharges: e.target.value })}
                          className="w-full text-right border rounded bg-white p-0.5"
                        />
                      ) : Number(b.otherCharges) > 0 ? (
                        b.otherCharges
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Arrears Interest */}
                    <td className="p-1.5 text-right text-amber-900 font-bold">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.arrearsInterest}
                          onChange={(e) => setEditForm({ ...editForm, arrearsInterest: e.target.value })}
                          className="w-full text-right border rounded bg-white p-0.5"
                        />
                      ) : Number(b.arrearsInterest) > 0 ? (
                        `${Number(b.arrearsInterest).toFixed(2)}`
                      ) : (
                        "0.00"
                      )}
                    </td>

                    {/* Arrears Balance */}
                    <td className="p-1.5 text-right font-semibold text-slate-700">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.arrearsBalance}
                          onChange={(e) => setEditForm({ ...editForm, arrearsBalance: e.target.value })}
                          className="w-full text-right border rounded bg-white p-0.5"
                        />
                      ) : Number(b.arrearsBalance) > 0 ? (
                        b.arrearsBalance
                      ) : (
                        "0"
                      )}
                    </td>

                    {/* Total Due */}
                    <td className="p-1.5 text-right font-bold text-amber-950 bg-amber-100/50">
                      ₹ {Number(b.totalDue).toLocaleString("en-IN")}
                    </td>

                    {/* Receipt No */}
                    <td className="p-1.5 text-center font-bold text-emerald-800">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.receiptNo || ""}
                          onChange={(e) => setEditForm({ ...editForm, receiptNo: e.target.value })}
                          className="w-full text-center border rounded bg-white p-0.5"
                        />
                      ) : (
                        b.receiptNo || "-"
                      )}
                    </td>

                    {/* Payment Date */}
                    <td className="p-1.5 text-center text-[10px]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.paymentDate || ""}
                          onChange={(e) => setEditForm({ ...editForm, paymentDate: e.target.value })}
                          className="w-full text-center border rounded bg-white p-0.5"
                        />
                      ) : (
                        b.paymentDate || "-"
                      )}
                    </td>

                    {/* Amount Received */}
                    <td className="p-1.5 text-right font-bold text-emerald-700">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.amountPaid}
                          onChange={(e) => setEditForm({ ...editForm, amountPaid: e.target.value })}
                          className="w-full text-right border rounded bg-white p-0.5"
                        />
                      ) : (
                        b.amountPaid
                      )}
                    </td>

                    {/* Remaining Balance */}
                    <td className="p-1.5 text-right font-bold text-amber-900 bg-amber-100/30">
                      ₹ {Number(b.remainingBalance).toLocaleString("en-IN")}
                    </td>

                    {/* Actions */}
                    <td className="p-1.5 text-center print:hidden">
                      {isEditing ? (
                        <button
                          onClick={handleSaveBill}
                          disabled={isSaving}
                          className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                          title="सेव्ह करा"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => startEdit(b)}
                            className="p-1 text-slate-600 hover:text-amber-800 hover:bg-amber-100 rounded cursor-pointer"
                            title="नोंद संपादित करा"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {onGenerateReceipt && (
                            <button
                              onClick={() => onGenerateReceipt(b, currentFlat)}
                              className="p-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 rounded cursor-pointer"
                              title="पावती बनवा व छापा"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Totals Summary Footer */}
            <tfoot>
              <tr className="bg-amber-200 text-slate-900 font-bold border-t-2 border-slate-800 divide-x-2 divide-slate-800 text-[11px]">
                <td className="p-2 font-sans text-center" colSpan={3}>
                  वार्षिक एकूण (Grand Total):
                </td>
                <td className="p-1.5 text-right">₹ {totalServiceCharge}</td>
                <td className="p-1.5 text-right">₹ {totalPropertyTax}</td>
                <td className="p-1.5 text-right">₹ {totalWaterCharge}</td>
                <td className="p-1.5 text-right">₹ {totalFestivalFee}</td>
                <td className="p-1.5 text-right">₹ {totalOtherCharges}</td>
                <td className="p-1.5 text-right text-amber-950">₹ {totalInterest.toFixed(2)}</td>
                <td className="p-1.5 text-right">-</td>
                <td className="p-1.5 text-right bg-amber-300 font-mono text-xs">
                  ₹ {(totalServiceCharge + totalPropertyTax + totalWaterCharge + totalFestivalFee + totalOtherCharges + totalInterest).toLocaleString("en-IN")}
                </td>
                <td className="p-1.5 text-center" colSpan={2}>-</td>
                <td className="p-1.5 text-right text-emerald-800 font-mono text-xs">
                  ₹ {totalPaid.toLocaleString("en-IN")}
                </td>
                <td className="p-1.5 text-right text-amber-950 bg-amber-300 font-mono text-xs">
                  ₹ {Number(lastRemaining).toLocaleString("en-IN")}
                </td>
                <td className="p-1.5 print:hidden"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Notebook Footnote */}
        <div className="mt-4 text-xs font-semibold text-slate-700 flex items-center justify-between">
          <div>टीप :- दरमहा देयक १ तारखेस प्राप्त होईल. वेळेत न भरल्यास नियम क्र. ७ अनुसार २१% दराने व्याज आकारले जाईल.</div>
          <div className="text-[11px] text-slate-500 font-mono">पान क्र. {String(currentFlat?.srNo || 1).padStart(2, "0")}</div>
        </div>
      </div>
    </div>
  );
};
