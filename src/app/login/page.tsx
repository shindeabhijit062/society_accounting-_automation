"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      // redirect to home
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <label className="block mb-2 text-sm">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded mb-3" />
        <label className="block mb-2 text-sm">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded mb-4" />
        <button type="submit" className="w-full bg-amber-600 text-white py-2 rounded font-semibold">Sign in</button>
      </form>
    </div>
  );
}
