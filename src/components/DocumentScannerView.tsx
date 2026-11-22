"use client";

import React, { useState } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  FileText,
  AlertCircle,
  RefreshCw,
  Eye,
  Zap,
} from "lucide-react";

interface DocumentScannerViewProps {
  onRefresh: () => void;
}

export const DocumentScannerView: React.FC<DocumentScannerViewProps> = ({ onRefresh }) => {
  const [documentType, setDocumentType] = useState<string>("ledger");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setExtractedData(null);
        setSuccessMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunOcr = async () => {
    if (!selectedImage) return;
    setIsScanning(true);
    setSuccessMessage("");
    try {
      const res = await fetch("/api/ocr-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: selectedImage,
          documentType,
          fileName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExtractedData(data.extractedData);
      } else {
        alert("स्कॅनिंग त्रुटी: " + data.error);
      }
    } catch (err: any) {
      console.error(err);
      alert("स्कॅनिंग करण्यात अडचण आली.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleApplyToDatabase = async () => {
    if (!extractedData) return;
    setIsApplying(true);
    try {
      const res = await fetch("/api/ocr-scan/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedData }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message || "डेटा ऑटो-फिल करण्यात आला!");
        onRefresh();
      } else {
        alert("त्रुटी: " + data.error);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  };

  const loadSamplePreset = (presetType: string) => {
    setDocumentType(presetType);
    setExtractedData(null);
    setSuccessMessage("");

    if (presetType === "ledger") {
      setFileName("sample_ledger_flat002.jpg");
      setSelectedImage(
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%23fef3c7'/><text x='50%' y='40%' font-size='22' font-weight='bold' fill='%2378350f' text-anchor='middle'>सदनिहाय वसुली रजिस्टर (फ्लॅट ००२)</text><text x='50%' y='55%' font-size='16' fill='%2392400e' text-anchor='middle'>कृष्णा बाबाजी गुरव (सन २०२५-२०२६)</text></svg>"
      );
    } else if (presetType === "expense") {
      setFileName("sample_april_expenses.jpg");
      setSelectedImage(
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%23f0fdf4'/><text x='50%' y='40%' font-size='22' font-weight='bold' fill='%2314532d' text-anchor='middle'>एप्रिल २०२५ खर्च पत्रक</text><text x='50%' y='55%' font-size='16' fill='%23166534' text-anchor='middle'>८ व्हाऊचर नोंदी व रोख/बँक जुळवणी</text></svg>"
      );
    } else {
      setFileName("sample_receipt_2953.jpg");
      setSelectedImage(
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%23f0f9ff'/><text x='50%' y='40%' font-size='22' font-weight='bold' fill='%230369a1' text-anchor='middle'>जमा पावती क्र. २९५३</text><text x='50%' y='55%' font-size='16' fill='%23075985' text-anchor='middle'>रक्कम ₹ ३,८३१/- (फ्लॅट ००२)</text></svg>"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Feature Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-6 rounded-2xl shadow-md border border-purple-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/30 rounded-xl border border-purple-400/40 text-purple-200">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-purple-100">
                <span>स्मार्ट फोटो स्कॅनर (AI Vision Register Reader)</span>
                <span className="bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                  मॅन्युअल एंट्री बंद करा
                </span>
              </h2>
              <p className="text-xs text-purple-200/90 mt-1 max-w-2xl">
                हाताने लिहिलेल्या वहीचे किंवा बिल पुस्तकाचे फोटो अपलोड करा. सिस्टीम आपोआप नाव, फ्लॅट क्रमांक, सेवाशुल्क, थकबाकी आणि पावती क्रमांक शोधून १-क्लिकमध्ये खात्यात नोंद करेल!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-purple-300 font-semibold">नमुना फोटो वापरून पहा:</span>
            <button
              onClick={() => loadSamplePreset("ledger")}
              className="bg-purple-800/80 hover:bg-purple-700 text-purple-100 text-xs px-2.5 py-1.5 rounded-lg border border-purple-600/50 cursor-pointer"
            >
              वसुली रजिस्टर
            </button>
            <button
              onClick={() => loadSamplePreset("expense")}
              className="bg-purple-800/80 hover:bg-purple-700 text-purple-100 text-xs px-2.5 py-1.5 rounded-lg border border-purple-600/50 cursor-pointer"
            >
              खर्च पत्रक
            </button>
            <button
              onClick={() => loadSamplePreset("receipt")}
              className="bg-purple-800/80 hover:bg-purple-700 text-purple-100 text-xs px-2.5 py-1.5 rounded-lg border border-purple-600/50 cursor-pointer"
            >
              पावती
            </button>
          </div>
        </div>
      </div>

      {/* Main Upload and OCR Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Photo Upload Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Upload className="w-4 h-4 text-purple-600" />
            <span>१. फोटो किंवा स्कॅन कॉपी अपलोड करा</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              कागदपत्राचा प्रकार निवडा
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
            >
              <option value="ledger">सदनिहाय वसुली रजिस्टर (Member Ledger Register)</option>
              <option value="expense">महिनानिहाय खर्च पत्रक (Monthly Expense Sheet)</option>
              <option value="receipt">जमा/खर्च पावती (Payment Receipt / Voucher)</option>
            </select>
          </div>

          {/* Drag & Drop Box */}
          <div className="border-2 border-dashed border-purple-300 bg-purple-50/30 hover:bg-purple-50/70 transition-colors rounded-2xl p-6 text-center space-y-3 cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {selectedImage ? (
              <div className="space-y-3">
                <img
                  src={selectedImage}
                  alt="Uploaded register"
                  className="max-h-56 mx-auto rounded-lg border border-purple-200 shadow-xs object-contain"
                />
                <p className="text-xs font-mono text-purple-900 font-semibold">{fileName}</p>
                <p className="text-[11px] text-purple-600">फोटो बदलण्यासाठी येथे क्लिक करा</p>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">फोटो निवडा किंवा कॅमेऱ्याने काढा</p>
                <p className="text-[11px] text-slate-400">
                  PNG, JPG किंवा JPEG फाईल अपलोड करा
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleRunOcr}
            disabled={!selectedImage || isScanning}
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI फोटो मधील डेटा वाचत आहे...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>फोटो स्कॅन करा व डेटा काढा (Extract Data)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side: Extracted Structured Data Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>२. फोटोमधून काढलेला डेटा (Extracted JSON)</span>
            </span>
            {extractedData && (
              <span className="text-[11px] font-normal bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                स्कॅनिंग पूर्ण
              </span>
            )}
          </h3>

          {!extractedData ? (
            <div className="h-64 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <FileText className="w-10 h-10 text-slate-300" />
              <p className="text-xs font-semibold text-slate-500">डाव्या बाजूने फोटो निवडून "फोटो स्कॅन करा" क्लिक करा.</p>
              <p className="text-[11px]">मराठी मधील सर्व तपशील आपोआप येथे दिसतील.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Extracted Data Card */}
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-3 max-h-80 overflow-y-auto font-sans text-xs">
                {extractedData.docType === "ledger" && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-purple-200 font-bold">
                      <span>सदनिका क्र: <span className="font-mono text-purple-900">{extractedData.flatNo}</span></span>
                      <span>नाव: <span className="text-slate-900">{extractedData.memberName}</span></span>
                    </div>

                    <p className="font-bold text-slate-700 text-[11px] mt-2">महिनानिहाय नोंदी ({extractedData.months?.length || 0} महिने):</p>
                    {extractedData.months?.map((m: any, idx: number) => (
                      <div key={idx} className="bg-white p-2 rounded border border-slate-200 space-y-1">
                        <div className="flex justify-between font-bold text-purple-950">
                          <span>{m.monthName} (देयक {m.billNo})</span>
                          <span>येणे: ₹ {m.totalDue} | जमा: ₹ {m.amountPaid}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex justify-between font-mono">
                          <span>सेवाशुल्क: ₹{m.serviceCharge} | व्याज: ₹{m.arrearsInterest}</span>
                          <span>पावती: {m.receiptNo || "निरंक"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {extractedData.docType === "expense" && (
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded border border-purple-200 font-bold text-purple-950">
                      महिना: {extractedData.monthName} ({extractedData.expenses?.length || 0} खर्च नोंदी)
                    </div>

                    {extractedData.expenses?.map((e: any, idx: number) => (
                      <div key={idx} className="bg-white p-2 rounded border border-slate-200 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-800">{e.voucherNo}. {e.description}</div>
                          <div className="text-[10px] text-slate-400">{e.date} ({e.category})</div>
                        </div>
                        <div className="text-right font-mono font-bold">
                          {e.cashAmount > 0 && <div className="text-amber-800">रोख: ₹{e.cashAmount}</div>}
                          {e.bankAmount > 0 && <div className="text-blue-800">बँक: ₹{e.bankAmount}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {extractedData.docType === "receipt" && (
                  <div className="bg-white p-3 rounded-lg border border-purple-200 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>पावती क्रमांक: {extractedData.receiptNo}</span>
                      <span>दिनांक: {extractedData.paymentDate}</span>
                    </div>
                    <div>फ्लॅट क्र: <span className="font-bold">{extractedData.flatNo}</span> ({extractedData.memberName})</div>
                    <div className="text-base font-bold font-mono text-emerald-700">जमा रक्कम: ₹ {extractedData.amountPaid}/-</div>
                  </div>
                )}
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApplyToDatabase}
                disabled={isApplying}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isApplying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>खात्यामध्ये नोंद सेव्ह करत आहे...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>१-क्लिकने सिस्टीममध्ये ऑटो-फिल करा (Auto-Fill to Account)</span>
                  </>
                )}
              </button>

              {successMessage && (
                <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold text-center animate-bounce">
                  ✨ {successMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
