"use client";

import React, { useState } from "react";
import { Plus, Users, Edit2, Trash2, Home, Search, Building } from "lucide-react";

interface FlatsDirectoryViewProps {
  flats: any[];
  onRefresh: () => void;
}

export const FlatsDirectoryView: React.FC<FlatsDirectoryViewProps> = ({ flats, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlat, setEditingFlat] = useState<any>(null);

  const [form, setForm] = useState({
    srNo: flats.length + 1,
    flatNo: "",
    memberName: "",
    areaSqft: 225,
    transferDate: "",
    transferFee: "0",
    entranceFee: "0",
    notes: "",
  });

  const filtered = flats.filter(
    (f) =>
      f.flatNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.memberName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFlat) {
        await fetch(`/api/flats/${editingFlat.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/flats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setIsModalOpen(false);
      setEditingFlat(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("ही सदनिका हटवायची आहे का?")) {
      await fetch(`/api/flats/${id}`, { method: "DELETE" });
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="फ्लॅट क्रमांक किंवा सभासदाचे नाव..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          onClick={() => {
            setEditingFlat(null);
            setForm({
              srNo: flats.length + 1,
              flatNo: "",
              memberName: "",
              areaSqft: 225,
              transferDate: "",
              transferFee: "0",
              entranceFee: "0",
              notes: "",
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>नवीन सदनिका जोडा</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-amber-50 border-b border-amber-200 font-bold text-amber-950 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-800" />
            <span>सोसायटी सदनिका व सभासद यादी (एकूण: {flats.length})</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3 text-center min-w-[50px]">अ.क्र.</th>
                <th className="p-3 text-center min-w-[80px]">फ्लॅट क्र.</th>
                <th className="p-3 min-w-[200px]">सभासदाचे नाव</th>
                <th className="p-3 text-center min-w-[90px]">क्षेत्रफळ (sqft)</th>
                <th className="p-3 text-center min-w-[100px]">हस्तांतरण शुल्क</th>
                <th className="p-3 text-center min-w-[100px]">प्रवेश फी</th>
                <th className="p-3 min-w-[120px]">टीप / मालक</th>
                <th className="p-3 text-center min-w-[80px]">क्रिया</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-amber-50/50">
                  <td className="p-3 text-center font-mono font-bold">{f.srNo}</td>
                  <td className="p-3 text-center font-mono font-bold text-amber-900">{f.flatNo}</td>
                  <td className="p-3 font-semibold text-slate-900">{f.memberName}</td>
                  <td className="p-3 text-center font-mono">{f.areaSqft} sqft</td>
                  <td className="p-3 text-center font-mono">₹ {f.transferFee || 0}</td>
                  <td className="p-3 text-center font-mono">₹ {f.entranceFee || 0}</td>
                  <td className="p-3 text-slate-500 text-[11px]">{f.notes || "-"}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          setEditingFlat(f);
                          setForm({
                            srNo: f.srNo,
                            flatNo: f.flatNo,
                            memberName: f.memberName,
                            areaSqft: f.areaSqft,
                            transferDate: f.transferDate || "",
                            transferFee: f.transferFee || "0",
                            entranceFee: f.entranceFee || "0",
                            notes: f.notes || "",
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-slate-600 hover:text-amber-800 hover:bg-amber-100 rounded cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-amber-200 space-y-4">
            <h3 className="text-lg font-bold text-amber-950">
              {editingFlat ? "सदनिका माहिती बदला" : "नवीन सदनिका जोडा"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">अ.क्र.</label>
                  <input
                    type="number"
                    value={form.srNo}
                    onChange={(e) => setForm({ ...form, srNo: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">फ्लॅट क्रमांक</label>
                  <input
                    type="text"
                    value={form.flatNo}
                    onChange={(e) => setForm({ ...form, flatNo: e.target.value })}
                    placeholder="001"
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">सभासदाचे नाव</label>
                <input
                  type="text"
                  value={form.memberName}
                  onChange={(e) => setForm({ ...form, memberName: e.target.value })}
                  placeholder="उदा. कृष्णा बाबाजी गुरव"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">क्षेत्रफळ (sqft)</label>
                  <input
                    type="number"
                    value={form.areaSqft}
                    onChange={(e) => setForm({ ...form, areaSqft: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">इतर / मूळ मालक नाव</label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">हस्तांतरण शुल्क (₹)</label>
                  <input
                    type="number"
                    value={form.transferFee}
                    onChange={(e) => setForm({ ...form, transferFee: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">प्रवेश फी (₹)</label>
                  <input
                    type="number"
                    value={form.entranceFee}
                    onChange={(e) => setForm({ ...form, entranceFee: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
