"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  HiOutlineViewGrid, 
  HiOutlinePencilAlt, 
  HiOutlineNewspaper, 
  HiOutlineMail, 
  HiOutlineGlobeAlt,
  HiOutlineShieldCheck
} from "react-icons/hi";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: HiOutlineViewGrid },
  { label: "Blogs", href: "/admin/blogs", icon: HiOutlinePencilAlt },
  { label: "News", href: "/admin/news", icon: HiOutlineNewspaper },
  { label: "Contacts", href: "/admin/contacts", icon: HiOutlineMail },
  { label: "View Site", href: "/", icon: HiOutlineGlobeAlt, external: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] h-screen bg-primary fixed left-0 top-0 text-white z-50 flex flex-col shadow-2xl border-r border-white/5">
      {/* Brand Section */}
      <div className="p-8 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-5 rounded-[24px] flex items-center gap-4 group"
        >
          <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-gold/20 transform group-hover:rotate-6 transition-transform duration-500">
            <HiOutlineShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-[18px] font-black tracking-tight leading-none">Brightlight</h1>
            <p className="text-[10px] text-gold font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">Admin Terminal</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item, index) => {
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                target={item.external ? "_blank" : undefined}
                className={`flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all duration-300 group no-underline relative overflow-hidden ${
                  isActive 
                    ? "bg-gold text-primary font-bold shadow-xl shadow-gold/20" 
                    : "text-white/85 hover:text-white hover:bg-white/5"
                }`}
              >
                {/* Active Indicator Background */}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gold"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-4 w-full">
                  <Icon 
                    size={22} 
                    className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-primary" : "text-white/40 group-hover:text-gold"}`} 
                  />
                  <span className="text-[15px] tracking-tight">{item.label}</span>
                  
                  {isActive && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" 
                    />
                  )}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-8 mt-auto">
        <div className="bg-white/5 rounded-[20px] p-5 border border-white/10 shadow-inner">
          <p className="text-[10px] text-white/60 uppercase font-black tracking-widest mb-3">Core Status</p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75" />
            </div>
            <p className="text-[13px] text-white/90 font-bold">Node Live • v2.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
