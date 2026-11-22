"use client";

import React from "react";
import { Printer, X } from "lucide-react";

interface PrintableVoucherModalProps {
  voucherData: {
    voucherNo: string;
    date: string;
    description: string;
    cashAmount: number;
    bankAmount: number;
    category?: string;
  } | null;
  societyData: any;
  onClose: () => void;
}

export const PrintableVoucherModal: React.FC<PrintableVoucherModalProps> = ({
  voucherData,
  societyData,
  onClose,
}) => {
  if (!voucherData) return null;

  const totalAmount = Number(voucherData.cashAmount || 0) + Number(voucherData.bankAmount || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-300">
        {/* Modal Top Bar */}
        <div className="bg-slate-800 text-white p-3 px-4 flex items-center justify-between print:hidden">
          <h3 className="text-xs font-bold">
            व्हाऊचर क्रमांक #{voucherData.voucherNo} छपाई
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिन्ट / PDF</span>
            </button>
            <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voucher Body */}
        <div className="p-6 md:p-8 space-y-6 font-serif bg-slate-50/50 text-slate-900">
          <div className="text-center border-b-2 border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              {societyData?.name || "श्री सद्गुरुकृपा २२/एच एसआरए सहकारा गृहनिर्माण संस्था मर्यादित"}
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-sans">{societyData?.address}</p>

            <div className="mt-3 inline-block bg-slate-800 text-white font-sans text-xs font-bold px-6 py-1 rounded-full">
              खर्च व्हाऊचर (EXPENSE VOUCHER)
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-sans border-b border-dashed border-slate-400 pb-3">
            <div>
              <span className="font-bold text-slate-600">व्हाऊचर क्रमांक: </span>
              <span className="font-mono text-sm font-bold text-slate-900">#{voucherData.voucherNo}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600">दिनांक: </span>
              <span className="font-mono font-bold">{voucherData.date}</span>
            </div>
          </div>

          <div className="space-y-4 text-xs md:text-sm font-sans">
            <div>
              <span className="text-slate-600 block text-xs mb-1">खर्चाचा सविस्तर तपशील:</span>
              <div className="p-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium">
                {voucherData.description}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-100 p-3 rounded-lg border border-slate-300 font-mono text-xs">
              <div>
                <span className="text-slate-600 block font-sans">रोख रक्कम:</span>
                <span className="font-bold text-sm text-slate-900">₹ {Number(voucherData.cashAmount).toLocaleString("en-IN")}.00</span>
              </div>
              <div>
                <span className="text-slate-600 block font-sans">बँक / चेक रक्कम:</span>
                <span className="font-bold text-sm text-slate-900">₹ {Number(voucherData.bankAmount).toLocaleString("en-IN")}.00</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-amber-100/70 p-3 rounded-lg border border-amber-300">
              <span className="font-bold text-amber-950 font-sans text-xs">एकूण खर्च दिलेली रक्कम:</span>
              <span className="font-bold font-mono text-base text-amber-950">
                ₹ {totalAmount.toLocaleString("en-IN")}.00
              </span>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-400 grid grid-cols-3 text-center text-xs font-sans">
            <div>
              <div className="h-10 border-b border-dashed border-slate-500 w-28 mx-auto mb-1"></div>
              <p className="font-bold text-slate-800">अध्यक्ष</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-500 w-28 mx-auto mb-1"></div>
              <p className="font-bold text-slate-800">सेक्रेटरी</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-500 w-28 mx-auto mb-1"></div>
              <p className="font-bold text-slate-800">{societyData?.treasurerName || "आर. के. मौर्य"}</p>
              <p className="text-[10px] text-slate-500">खजिनदार</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
