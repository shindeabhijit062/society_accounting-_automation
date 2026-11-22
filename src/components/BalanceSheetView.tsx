"use client";

import React, { useState } from "react";
import {
  Plus,
  Printer,
  Edit2,
  TrendingUp,
  CheckCircle,
  FileSpreadsheet,
  Building,
  ShieldCheck,
  Scale,
} from "lucide-react";

interface BalanceSheetViewProps {
  balanceSheetData: {
    liabilities: any[];
    assets: any[];
    summaryStats?: any;
  };
  societyData: any;
  onRefresh: () => void;
}

export const BalanceSheetView: React.FC<BalanceSheetViewProps> = ({
  balanceSheetData,
  societyData,
  onRefresh,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    categoryType: "liability",
    mainGroup: "Current Liabilities",
    mainGroupMr: "चालू देणी",
    itemName: "",
    itemNameMr: "",
    amount: "",
  });

  const { liabilities = [], assets = [], summaryStats } = balanceSheetData;

  // Group liabilities by mainGroup
  const groupedLiabilities: Record<string, { mrName: string; items: any[] }> = {};
  liabilities.forEach((item) => {
    const group = item.mainGroup;
    if (!groupedLiabilities[group]) {
      groupedLiabilities[group] = { mrName: item.mainGroupMr, items: [] };
    }
    groupedLiabilities[group].items.push(item);
  });

  // Group assets by mainGroup
  const groupedAssets: Record<string, { mrName: string; items: any[] }> = {};
  assets.forEach((item) => {
    const group = item.mainGroup;
    if (!groupedAssets[group]) {
      groupedAssets[group] = { mrName: item.mainGroupMr, items: [] };
    }
    groupedAssets[group].items.push(item);
  });

  // Calculate totals
  const totalLiabilities = liabilities.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalAssets = assets.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await fetch("/api/balance-sheet", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingItem.id,
            itemName: formData.itemName,
            itemNameMr: formData.itemNameMr,
            amount: formData.amount,
          }),
        });
      } else {
        await fetch("/api/balance-sheet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setIsAddModalOpen(false);
      setEditingItem(null);
      onRefresh();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      categoryType: item.categoryType,
      mainGroup: item.mainGroup,
      mainGroupMr: item.mainGroupMr,
      itemName: item.itemName,
      itemNameMr: item.itemNameMr,
      amount: item.amount,
    });
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50 p-4 rounded-xl border border-amber-200 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-700" />
            <span>सोसायटी ताळेबंद ३१ मार्च २०२६ अखेर (Balance Sheet)</span>
          </h2>
          <p className="text-xs text-amber-800 mt-0.5">
            कायदेशीर लेखापरीक्षण मानकांनुसार (Co-op Housing Audit Format) पूर्ण ऑटो-गणती
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({
                categoryType: "liability",
                mainGroup: "Current Liabilities",
                mainGroupMr: "चालू देणी",
                itemName: "",
                itemNameMr: "",
                amount: "",
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>नवीन खात्याची नोंद</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-amber-800" />
            <span>प्रिंट / PDF डाऊनलोड</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">एकूण देणी (Total Liabilities)</div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
            ₹ {totalLiabilities.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>भाग भांडवल + राखीव निधी व देणी</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">एकूण मत्ता (Total Assets)</div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
            ₹ {totalAssets.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-blue-600 mt-1 flex items-center gap-1 font-medium">
            <Building className="w-3.5 h-3.5" />
            <span>बँक शिल्लक + एफडी + मालमत्ता</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">सभासद थकबाकी (Member Arrears)</div>
          <div className="text-xl font-bold text-amber-700 mt-1 font-mono">
            ₹ {summaryStats?.totalMemberArrears?.toLocaleString("en-IN") || "0"}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">थकबाकी व व्याज जमा बाकी</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">चालू वर्षाचा जमा-खर्च नफा</div>
          <div className="text-xl font-bold text-emerald-700 mt-1 font-mono">
            ₹ 10,741.00
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>सरप्लस शिल्लक (Surplus)</span>
          </div>
        </div>
      </div>

      {/* Main Printable Balance Sheet Ledger Sheet */}
      <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-md print:shadow-none print:border-none print:p-0">
        {/* Printable Header */}
        <div className="text-center mb-6 border-b border-amber-200 pb-4">
          <h2 className="text-xl font-bold text-amber-950 font-serif">
            {societyData?.name || "श्री सद्गुरुकृपा २२/एच एसआरए सहकारा गृहनिर्माण संस्था मर्यादित"}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {societyData?.address} | नोंदणी क्र: {societyData?.regNo}
          </p>
          <div className="inline-block bg-amber-100 text-amber-900 text-sm font-bold px-4 py-1 rounded-full mt-2 border border-amber-300">
            ताळेबंद पत्रक (Balance Sheet) - १ एप्रिल २०२५ ते ३१ मार्च २०२६
          </div>
        </div>

        {/* Balance Sheet Grid (Liabilities vs Assets) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
          {/* LIABILITIES COLUMN */}
          <div className="border border-slate-300 rounded-xl overflow-hidden bg-white flex flex-col justify-between">
            <div>
              <div className="bg-amber-900 text-white font-bold text-center py-2.5 px-3 text-sm flex justify-between items-center">
                <span>देणी (Liabilities)</span>
                <span className="text-xs font-normal opacity-80">रक्कम (₹)</span>
              </div>

              <div className="p-3 space-y-4 text-xs font-sans">
                {Object.entries(groupedLiabilities).map(([groupKey, groupObj]) => {
                  const groupTotal = groupObj.items.reduce((s, i) => s + Number(i.amount || 0), 0);
                  return (
                    <div key={groupKey} className="border-b border-slate-200 pb-2">
                      <div className="font-bold text-slate-800 flex justify-between items-center bg-slate-50 p-1.5 rounded border border-slate-200">
                        <span>{groupObj.mrName} ({groupKey})</span>
                        <span className="font-mono text-slate-900 font-bold">
                          {groupTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="mt-1 space-y-1 pl-2">
                        {groupObj.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center hover:bg-amber-50/50 p-1 rounded group">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-700 font-medium">{item.itemNameMr}</span>
                              <span className="text-[10px] text-slate-400">({item.itemName})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-slate-900">
                                {Number(item.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                              </span>
                              <button
                                onClick={() => openEditModal(item)}
                                className="opacity-0 group-hover:opacity-100 text-amber-700 hover:text-amber-900 p-0.5 print:hidden cursor-pointer"
                                title="संपादित करा"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Liabilities Total Footer */}
            <div className="bg-amber-100 border-t-2 border-amber-400 p-3 font-bold text-amber-950 flex justify-between items-center text-sm">
              <span>एकूण देणी (Total Liabilities):</span>
              <span className="font-mono text-base">
                ₹ {totalLiabilities.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* ASSETS COLUMN */}
          <div className="border border-slate-300 rounded-xl overflow-hidden bg-white flex flex-col justify-between">
            <div>
              <div className="bg-emerald-900 text-white font-bold text-center py-2.5 px-3 text-sm flex justify-between items-center">
                <span>मत्ता / मालमत्ता (Assets)</span>
                <span className="text-xs font-normal opacity-80">रक्कम (₹)</span>
              </div>

              <div className="p-3 space-y-4 text-xs font-sans">
                {Object.entries(groupedAssets).map(([groupKey, groupObj]) => {
                  const groupTotal = groupObj.items.reduce((s, i) => s + Number(i.amount || 0), 0);
                  return (
                    <div key={groupKey} className="border-b border-slate-200 pb-2">
                      <div className="font-bold text-slate-800 flex justify-between items-center bg-slate-50 p-1.5 rounded border border-slate-200">
                        <span>{groupObj.mrName} ({groupKey})</span>
                        <span className="font-mono text-slate-900 font-bold">
                          {groupTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="mt-1 space-y-1 pl-2">
                        {groupObj.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center hover:bg-emerald-50/50 p-1 rounded group">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-700 font-medium">{item.itemNameMr}</span>
                              <span className="text-[10px] text-slate-400">({item.itemName})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-slate-900">
                                {Number(item.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                              </span>
                              <button
                                onClick={() => openEditModal(item)}
                                className="opacity-0 group-hover:opacity-100 text-emerald-700 hover:text-emerald-900 p-0.5 print:hidden cursor-pointer"
                                title="संपादित करा"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assets Total Footer */}
            <div className="bg-emerald-100 border-t-2 border-emerald-400 p-3 font-bold text-emerald-950 flex justify-between items-center text-sm">
              <span>एकूण मत्ता (Total Assets):</span>
              <span className="font-mono text-base">
                ₹ {totalAssets.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Audit Verification Footer & Signatures */}
        <div className="mt-8 pt-6 border-t border-slate-300">
          <div className="text-[11px] text-slate-600 mb-6 italic text-center">
            टीप: वरील ताळेबंद पत्रक महाराष्ट्र सहकारी संस्था अधिनियम १९६० च्या नियमानुसार तयार करण्यात आले असून ऑडिट पुस्तकांशी जुळणारे आहे.
          </div>

          <div className="grid grid-cols-3 text-center gap-4 pt-4">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 max-w-[140px] mx-auto"></div>
              <p className="text-xs font-bold text-slate-800 mt-1">
                {societyData?.chairmanName || "श्री अध्यक्ष"}
              </p>
              <p className="text-[11px] text-slate-500">अध्यक्ष</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 max-w-[140px] mx-auto"></div>
              <p className="text-xs font-bold text-slate-800 mt-1">
                {societyData?.secretaryName || "श्री सेक्रेटरी"}
              </p>
              <p className="text-[11px] text-slate-500">सेक्रेटरी</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 max-w-[140px] mx-auto"></div>
              <p className="text-xs font-bold text-slate-800 mt-1">
                {societyData?.treasurerName || "आर. के. मौर्य"}
              </p>
              <p className="text-[11px] text-slate-500">खजिनदार</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-amber-200 space-y-4">
            <h3 className="text-lg font-bold text-amber-950">
              {editingItem ? "ताळेबंद नोंद संपादित करा" : "नवीन ताळेबंद नोंद जोडा"}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              {!editingItem && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">प्रकार</label>
                  <select
                    value={formData.categoryType}
                    onChange={(e) => setFormData({ ...formData, categoryType: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="liability">देणी (Liability)</option>
                    <option value="asset">मत्ता (Asset)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">गट नाव (Group Name)</label>
                <input
                  type="text"
                  value={formData.mainGroupMr}
                  onChange={(e) => setFormData({ ...formData, mainGroupMr: e.target.value })}
                  placeholder="उदा. चालू देणी / गुंतवणूक"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">बाब नाव (मराठीत)</label>
                <input
                  type="text"
                  value={formData.itemNameMr}
                  onChange={(e) => setFormData({ ...formData, itemNameMr: e.target.value })}
                  placeholder="उदा. लिफ्ट दुरुस्ती तरतूद निधी"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">बाब नाव (इंग्रजीत)</label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="e.g. Lift Repair Provision"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">रक्कम (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
    </div>
  );
};
