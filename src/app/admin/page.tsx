"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiOutlineLockClosed, HiOutlineUser, HiOutlineShieldCheck, HiOutlineSparkles } from "react-icons/hi";
import { motion } from "framer-motion";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [setupDone, setSetupDone] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("bl_admin_token");
    if (token) router.replace("/admin/dashboard");
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("bl_admin_token", data.token);
      localStorage.setItem("bl_admin_user", data.username);
      router.replace("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Setup failed");
      setSetupDone(true);
      setShowSetup(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gold/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-light/20 rounded-full blur-[140px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[520px] px-6 relative z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[48px] p-16 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
          <div className="text-center mb-12">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-24 h-24 bg-gold rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-gold/20 cursor-pointer"
            >
               <HiOutlineShieldCheck size={48} className="text-primary" />
            </motion.div>
            <h1 className="text-[32px] font-black text-white tracking-tighter uppercase mb-2">Admin Terminal</h1>
            <p className="text-[12px] text-white/30 font-black tracking-[0.4em] uppercase">
              Brightlight Immigration hub
            </p>
          </div>

          {setupDone && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-2xl px-6 py-4 text-[14px] text-green-400 mb-10 font-bold text-center flex items-center justify-center gap-3"
            >
              <HiOutlineSparkles /> Central Archive Initialized. Log in.
            </motion.div>
          )}

          <form
            onSubmit={showSetup ? handleSetup : handleLogin}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="relative group">
                <label className="block text-[11px] font-black text-white/50 uppercase tracking-[0.3em] mb-4 ml-2">
                  Security Alias
                </label>
                <div className="relative">
                   <HiOutlineUser className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-gold transition-colors" size={20} />
                   <input
                     type="text"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     required
                     className="w-full bg-white/[0.05] border border-white/10 rounded-[22px] pl-16 pr-8 py-5 text-[16px] text-white focus:bg-white/10 focus:border-gold outline-none transition-all placeholder:text-white/10"
                     placeholder="OPERATOR_ID"
                   />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-[11px] font-black text-white/50 uppercase tracking-[0.3em] mb-4 ml-2">
                  Access Key
                </label>
                <div className="relative">
                   <HiOutlineLockClosed className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-gold transition-colors" size={20} />
                   <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     className="w-full bg-white/[0.05] border border-white/10 rounded-[22px] pl-16 pr-8 py-5 text-[16px] text-white focus:bg-white/10 focus:border-gold outline-none transition-all placeholder:text-white/10"
                     placeholder="••••••••"
                   />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-2xl px-6 py-4 text-[13px] text-red-400 font-bold flex items-center gap-3"
              >
                <span className="text-[18px]">⚠️</span> {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-primary p-6 rounded-[24px] text-[16px] font-black uppercase tracking-[0.2em] hover:shadow-[0_10px_40px_rgba(232,196,124,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 transition-all cursor-pointer mt-6"
            >
              {loading
                ? "Authorizing..."
                : showSetup
                  ? "Initialize Core"
                  : "Authorize Access"}
            </button>
          </form>

          <div className="text-center mt-12">
             <button
                onClick={() => {
                  setShowSetup(!showSetup);
                  setError("");
                }}
                className="text-[11px] font-black text-white/20 hover:text-gold uppercase tracking-[0.4em] transition-colors cursor-pointer"
              >
                {showSetup ? "← Standard Login" : "Terminal Initialization"}
              </button>
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 inset-x-0 text-center">
         <p className="text-[10px] font-black text-white/5 uppercase tracking-[0.8em]">Secure Protocol v2.5.0</p>
      </div>
    </div>
  );
}
