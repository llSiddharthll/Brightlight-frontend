"use client";

import { useRouter } from "next/navigation";
import { HiOutlineUserCircle, HiOutlineLogout } from "react-icons/hi";
import { motion } from "framer-motion";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({
  title,
  subtitle,
}: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("bl_admin_token");
    localStorage.removeItem("bl_admin_user");
    router.replace("/admin");
  };

  const username =
    typeof window !== "undefined"
      ? localStorage.getItem("bl_admin_user") || "Admin"
      : "Admin";

  return (
    <header className="h-[100px] bg-white/70 backdrop-blur-xl sticky top-0 z-40 px-12 flex items-center justify-between border-b border-primary/10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {title && <h1 className="text-[26px] font-black text-primary tracking-tight leading-none">{title}</h1>}
        {subtitle && <p className="text-[13px] text-slate-500 font-bold mt-2 uppercase tracking-widest">{subtitle}</p>}
      </motion.div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 pr-8 border-r border-slate-200">
          <div className="w-12 h-12 bg-slate-100 rounded-[18px] flex items-center justify-center text-slate-400 transform hover:scale-110 transition-transform shadow-sm">
            <HiOutlineUserCircle size={28} />
          </div>
          <div>
            <p className="text-[14px] font-black text-primary leading-none uppercase tracking-tight">{username}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               <p className="text-[11px] text-green-600 font-black uppercase tracking-widest">Active session</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-[14px] font-black text-red-500 hover:text-white bg-red-500/5 hover:bg-red-500 py-3.5 px-6 rounded-[18px] transition-all duration-300 group"
        >
          <HiOutlineLogout size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest">Terminate</span>
        </button>
      </div>
    </header>
  );
}
