"use client";

import React from "react";
import { Printer, X, Download } from "lucide-react";

interface PrintableReceiptModalProps {
  receiptData: {
    receiptNo: string;
    flatNo: string;
    memberName: string;
    monthName: string;
    date: string;
    amount: number;
    paymentMode: string;
    serviceCharge?: number;
    propertyTax?: number;
    waterCharge?: number;
    arrearsInterest?: number;
    arrearsBalance?: number;
  } | null;
  societyData: any;
  onClose: () => void;
}

export const PrintableReceiptModal: React.FC<PrintableReceiptModalProps> = ({
  receiptData,
  societyData,
  onClose,
}) => {
  if (!receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-amber-300">
        {/* Modal Top Bar */}
        <div className="bg-amber-900 text-amber-100 p-3 px-4 flex items-center justify-between print:hidden">
          <h3 className="text-xs font-bold flex items-center gap-2">
            <span>पावती क्रमांक #{receiptData.receiptNo} छपाई पूर्वदृश्य</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिन्ट / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-amber-200 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 md:p-8 space-y-6 font-serif bg-amber-50/20 text-slate-900">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <h2 className="text-lg md:text-xl font-bold text-amber-950">
              {societyData?.name || "श्री सद्गुरुकृपा २२/एच एसआरए सहकारा गृहनिर्माण संस्था मर्यादित"}
            </h2>
            <p className="text-xs text-slate-700 mt-1 font-sans">
              {societyData?.address}
            </p>
            <p className="text-[11px] text-slate-600 font-mono mt-0.5">
              नोंदणी क्रमांक: {societyData?.regNo}
            </p>

            <div className="mt-3 inline-block bg-amber-900 text-amber-100 font-sans text-xs font-bold px-6 py-1 rounded-full border border-amber-700 shadow-xs">
              जमा पावती (RECEIPT)
            </div>
          </div>

          {/* Receipt Top Row */}
          <div className="flex justify-between items-center text-xs font-sans border-b border-dashed border-slate-400 pb-3">
            <div>
              <span className="font-bold text-slate-600">पावती क्रमांक: </span>
              <span className="font-mono text-sm font-bold text-amber-900">#{receiptData.receiptNo}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600">दिनांक: </span>
              <span className="font-mono font-bold">{receiptData.date || "०६.०४.२०२५"}</span>
            </div>
          </div>

          {/* Receipt Content */}
          <div className="space-y-3 text-xs md:text-sm font-sans">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-slate-600">श्री / श्रीमती:</span>
              <span className="font-bold border-b border-slate-700 text-slate-900 text-base grow">
                {receiptData.memberName}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <div>
                <span className="text-slate-600">सदनिका क्रमांक: </span>
                <span className="font-mono font-bold text-base bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  {receiptData.flatNo}
                </span>
              </div>
              <div>
                <span className="text-slate-600">महिना: </span>
                <span className="font-bold text-slate-900">{receiptData.monthName}</span>
              </div>
            </div>

            {/* Fees Table Breakdown */}
            <div className="border border-slate-400 rounded-lg overflow-hidden my-3">
              <table className="w-full text-xs text-left">
                <thead className="bg-amber-100 font-bold border-b border-slate-400">
                  <tr>
                    <th className="p-2">विवरण (Particulars)</th>
                    <th className="p-2 text-right">रक्कम (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono">
                  <tr>
                    <td className="p-2 font-sans">सेवा शुल्क (Service Charges)</td>
                    <td className="p-2 text-right">₹ {receiptData.serviceCharge || 400}.00</td>
                  </tr>
                  {Number(receiptData.propertyTax) > 0 && (
                    <tr>
                      <td className="p-2 font-sans">मालमत्ता कर (Property Tax)</td>
                      <td className="p-2 text-right">₹ {receiptData.propertyTax}.00</td>
                    </tr>
                  )}
                  {Number(receiptData.waterCharge) > 0 && (
                    <tr>
                      <td className="p-2 font-sans">पाणी शुल्क (Water Charges)</td>
                      <td className="p-2 text-right">₹ {receiptData.waterCharge}.00</td>
                    </tr>
                  )}
                  {Number(receiptData.arrearsInterest) > 0 && (
                    <tr>
                      <td className="p-2 font-sans">थकबाकी व्याज (Arrears Interest)</td>
                      <td className="p-2 text-right">₹ {receiptData.arrearsInterest}.00</td>
                    </tr>
                  )}
                  {Number(receiptData.arrearsBalance) > 0 && (
                    <tr>
                      <td className="p-2 font-sans">मागील थकबाकी (Arrears Balance)</td>
                      <td className="p-2 text-right">₹ {receiptData.arrearsBalance}.00</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-amber-200/80 font-bold border-t-2 border-slate-800">
                  <tr>
                    <td className="p-2 font-sans">एकूण जमा प्राप्त रक्कम (Total Received):</td>
                    <td className="p-2 text-right font-mono text-sm text-amber-950">
                      ₹ {Number(receiptData.amount).toLocaleString("en-IN")}.00
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div>
                <span className="text-slate-600 text-xs">भरणा प्रकार: </span>
                <span className="font-bold uppercase text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                  {receiptData.paymentMode === "cash" ? "रोख (Cash)" : "बँक / यूपीआय"}
                </span>
              </div>
              <div className="text-sm font-bold font-mono text-amber-900 border-2 border-amber-800 p-2 rounded-lg bg-amber-100/50">
                रक्कम: ₹ {Number(receiptData.amount).toLocaleString("en-IN")}/-
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-400 flex justify-between items-end text-xs font-sans">
            <div className="text-center">
              <div className="w-20 h-10 border border-dashed border-amber-600 rounded flex items-center justify-center text-[10px] text-amber-800 font-bold opacity-60">
                सोसायटी शिक्का
              </div>
            </div>
            <div className="text-center">
              <div className="h-10 border-b border-dashed border-slate-500 w-32 mb-1"></div>
              <p className="font-bold text-slate-800">{societyData?.treasurerName || "खजिनदार"}</p>
              <p className="text-[10px] text-slate-500">व्यवस्थापक / खजिनदार स्वाक्षरी</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
