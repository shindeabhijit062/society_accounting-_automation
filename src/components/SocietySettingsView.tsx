"use client";

import React, { useState } from "react";
import { Building2, Save, CheckCircle } from "lucide-react";

interface SocietySettingsViewProps {
  societyData: any;
  onRefresh: () => void;
}

export const SocietySettingsView: React.FC<SocietySettingsViewProps> = ({
  societyData,
  onRefresh,
}) => {
  const [form, setForm] = useState({
    id: societyData?.id || "soc-1",
    name: societyData?.name || "",
    regNo: societyData?.regNo || "",
    address: societyData?.address || "",
    financialYear: societyData?.financialYear || "२०२५ - २०२६",
    defaultServiceCharge: societyData?.defaultServiceCharge || "400",
    interestRatePercent: societyData?.interestRatePercent || "21",
    chairmanName: societyData?.chairmanName || "श्री अध्यक्ष",
    secretaryName: societyData?.secretaryName || "श्री सेक्रेटरी",
    treasurerName: societyData?.treasurerName || "आर. के. मौर्य",
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/society", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
          <div className="p-3 bg-amber-100 text-amber-900 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-950">सोसायटी प्रोफाइल व कायदेशीर माहिती</h2>
            <p className="text-xs text-slate-500">पावती, ताळेबंद व रजिस्टरवर छापली जाणारी अधिकृत माहिती</p>
          </div>
        </div>

        {isSaved && (
          <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <span>सोसायटीची माहिती यशस्वीपणे अद्ययावत केली!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-slate-700 mb-1">गृहनिर्माण संस्थेचे नाव</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">नोंदणी क्रमांक (Registration No)</label>
              <input
                type="text"
                value={form.regNo}
                onChange={(e) => setForm({ ...form, regNo: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">आर्थिक वर्ष (Financial Year)</label>
              <input
                type="text"
                value={form.financialYear}
                onChange={(e) => setForm({ ...form, financialYear: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">सोसायटीचा पूर्ण पत्ता</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">दरमहा मुलभूत सेवाशुल्क (₹)</label>
              <input
                type="number"
                value={form.defaultServiceCharge}
                onChange={(e) => setForm({ ...form, defaultServiceCharge: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">थकबाकी वार्षिक व्याज दर (%)</label>
              <input
                type="number"
                value={form.interestRatePercent}
                onChange={(e) => setForm({ ...form, interestRatePercent: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-amber-900"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3 text-xs">कार्यकारिणी पदाधिकारी नावे (Signatories)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">अध्यक्ष नाव</label>
                <input
                  type="text"
                  value={form.chairmanName}
                  onChange={(e) => setForm({ ...form, chairmanName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">सेक्रेटरी नाव</label>
                <input
                  type="text"
                  value={form.secretaryName}
                  onChange={(e) => setForm({ ...form, secretaryName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">खजिनदार नाव</label>
                <input
                  type="text"
                  value={form.treasurerName}
                  onChange={(e) => setForm({ ...form, treasurerName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold cursor-pointer flex items-center gap-2 text-xs shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>माहिती सेव्ह करा</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
