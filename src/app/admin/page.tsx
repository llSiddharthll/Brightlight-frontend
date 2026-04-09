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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f18] relative overflow-hidden font-sans">
      {/* Mesh Gradient Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#0a0f18_100%)] z-1" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] px-4 relative z-10"
      >
        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.01] backdrop-blur-xl border border-white/[0.05] rounded-[32px] p-8 shadow-[0_32px_128px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
          <div className="text-center mb-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 bg-gradient-to-tr from-gold to-[#fcebb6] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(232,196,124,0.15)]"
            >
               <HiOutlineShieldCheck size={28} className="text-primary" />
            </motion.div>
            <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Admin Terminal</h1>
            <p className="text-[9px] text-white/40 font-medium tracking-[0.2em] uppercase">
              Secure authentication
            </p>
          </div>

          {setupDone && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 text-[11px] text-emerald-400 mb-5 font-medium text-center flex items-center justify-center gap-2"
            >
              <HiOutlineSparkles size={14} /> Setup Complete. Access Enabled.
            </motion.div>
          )}

          <form
            onSubmit={showSetup ? handleSetup : handleLogin}
            className="space-y-5"
          >
            <div className="space-y-3.5">
              <div className="relative">
                <label className="block text-[9px] font-bold text-white/30 uppercase tracking-[0.15em] mb-2 ml-1">
                  Security Alias
                </label>
                <div className="relative group">
                   <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={16} />
                   <input
                     type="text"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     required
                     className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-5 py-3.5 text-[14px] text-white focus:bg-white/[0.06] focus:border-gold/30 outline-none transition-all placeholder:text-white/20"
                     placeholder="Enter username"
                   />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[9px] font-bold text-white/30 uppercase tracking-[0.15em] mb-2 ml-1">
                  Access Key
                </label>
                <div className="relative group">
                   <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={16} />
                   <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-5 py-3.5 text-[14px] text-white focus:bg-white/[0.06] focus:border-gold/30 outline-none transition-all placeholder:text-white/20"
                     placeholder="Enter password"
                   />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2.5 text-[11px] text-rose-400 font-medium flex items-center gap-2"
              >
                <span>⚠️</span> {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-[#0a0f18] py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-[0.1em] hover:brightness-110 active:scale-[0.98] disabled:opacity-30 transition-all cursor-pointer shadow-lg shadow-gold/5"
            >
              {loading
                ? "Authorizing..."
                : showSetup
                  ? "Initialize Core"
                  : "Authorize Access"}
            </button>
          </form>

          <div className="text-center mt-6 pt-5 border-t border-white/[0.04]">
             <button
                onClick={() => {
                  setShowSetup(!showSetup);
                  setError("");
                }}
                className="text-[9px] font-bold text-white/20 hover:text-gold uppercase tracking-[0.2em] transition-colors cursor-pointer"
              >
                {showSetup ? "← Return to Login" : "Initialize New Terminal"}
              </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
