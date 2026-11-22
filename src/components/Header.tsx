"use client";

import React from "react";
import {
  FileText,
  BookOpen,
  DollarSign,
  Camera,
  Printer,
  Users,
  Settings,
  Building2,
  RefreshCw,
  Award,
} from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  societyData: any;
  onRefreshData?: () => void;
  isRecalculating?: boolean;
  onRecalculateAll?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  societyData,
  onRefreshData,
  isRecalculating,
  onRecalculateAll,
}) => {
  const tabs = [
    { id: "balance-sheet", label: "ताळेबंद (Balance Sheet)", icon: FileText, color: "text-blue-600" },
    { id: "maintenance-ledger", label: "सदनिहाय वसुली रजिस्टर", icon: BookOpen, color: "text-emerald-600" },
    { id: "expense-register", label: "महिनानिहाय खर्च पत्रक", icon: DollarSign, color: "text-amber-600" },
    { id: "scanner", label: "फोटो स्कॅनर (OCR Auto-Fill)", icon: Camera, color: "text-purple-600" },
    { id: "receipts", label: "पावती व व्हाऊचर छपाई", icon: Printer, color: "text-teal-600" },
    { id: "flats", label: "सदनिका व सभासद यादी", icon: Users, color: "text-indigo-600" },
    { id: "settings", label: "संस्था माहिती", icon: Settings, color: "text-slate-600" },
  ];

  return (
    <header className="bg-white border-b border-amber-200 shadow-sm sticky top-0 z-40">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-amber-900 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="p-2.5 bg-amber-500/20 backdrop-blur rounded-xl border border-amber-400/30 text-amber-200 shrink-0">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-amber-100 drop-shadow-sm font-sans">
                {societyData?.name || "श्री सद्गुरुकृपा २२/एच एसआरए सहकारा गृहनिर्माण संस्था मर्यादित"}
              </h1>
              <p className="text-xs md:text-sm text-amber-200/90 flex flex-wrap items-center justify-center md:justify-start gap-2 mt-0.5">
                <span className="bg-amber-800/60 px-2 py-0.5 rounded border border-amber-600/40">
                  नोंदणी क्र: {societyData?.regNo || "२२/एच/एसआरए/सहकारा/चांदिवली"}
                </span>
                <span>•</span>
                <span>{societyData?.address || "इमारत क्र. २२/एच, संघर्ष नगर, चांदिवली (पूर्व), मुंबई - ४०० ०७२"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-amber-950/60 backdrop-blur px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-100 text-xs text-right">
              <div className="font-semibold text-amber-300">आर्थिक वर्ष (FY)</div>
              <div className="text-sm font-bold font-mono">{societyData?.financialYear || "२०२५ - २०२६"}</div>
            </div>

            {onRecalculateAll && (
              <button
                onClick={onRecalculateAll}
                disabled={isRecalculating}
                title="थकबाकी व २१% व्याजाची सर्व खात्यांत आपोआप फेरगणती करा"
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? "animate-spin" : ""}`} />
                <span>व्याज/थकबाकी ऑटो-गणती</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 overflow-x-auto no-scrollbar">
        <nav className="flex items-center space-x-1 py-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-sm font-semibold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-800" : tab.color}`} />
                <span>{tab.label}</span>
                {tab.id === "scanner" && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] uppercase tracking-wide bg-purple-600 text-white font-bold rounded-full animate-pulse">
                    नवीन
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
