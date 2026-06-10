"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/home");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white font-sans">
      <div className="w-full max-w-[420px] px-6">
        <div className="flex flex-col items-center">
            {/* Logo Section */}
            <div className="mb-10">
              <Image
                src="/bznxlogo.png"
                alt="BZNX Logo"
                width={120}
                height={40}
                className="object-contain"
                priority
              />
            </div>

            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-[#091d37] uppercase tracking-tighter mb-2">
                Admin Access
              </h2>
              <p className="text-slate-400 text-sm font-medium tracking-tight">
                Manage the BZNX platform content
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-xs font-bold uppercase tracking-wider text-center border border-red-100">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="w-full space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin_username"
                    className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-xl text-slate-900 placeholder:text-slate-300 focus:border-[#00C4B4] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-xl text-slate-900 placeholder:text-slate-300 focus:border-[#00C4B4] outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#091d37] text-white font-black py-4 rounded-xl hover:bg-[#00C4B4] transition-all duration-300 disabled:opacity-50 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 mt-4"
              >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={16} />
                    </>
                  )}
              </button>
            </form>
          
        </div>
      </div>
    </div>
  );
}
