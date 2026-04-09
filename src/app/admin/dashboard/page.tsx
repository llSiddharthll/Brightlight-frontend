"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { motion } from "framer-motion";
import { 
  HiOutlinePencilAlt, 
  HiOutlineNewspaper, 
  HiOutlineMailOpen, 
  HiOutlineArrowNarrowRight,
  HiOutlinePlus,
  HiOutlineDuplicate
} from "react-icons/hi";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const router = useRouter();
  const [blogCount, setBlogCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("bl_admin_token");
    if (!token) {
      router.replace("/admin");
      return;
    }

    Promise.all([
      fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API}/api/blogs`),
      fetch(`${API}/api/news`),
      fetch(`${API}/api/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(async ([me, blogs, news, contacts]) => {
        if (!me.ok) {
          router.replace("/admin");
          return;
        }
        const blogsData = await blogs.json().catch(() => []);
        const newsData = await news.json().catch(() => []);
        const contactsData = await contacts.json().catch(() => ({ total: 0 }));
        
        setBlogCount(blogsData.total || (Array.isArray(blogsData) ? blogsData.length : 0));
        setNewsCount(newsData.total || (Array.isArray(newsData) ? newsData.length : 0));
        setContactCount(contactsData.total || 0);
        setLoading(false);
      })
      .catch(() => {
        router.replace("/admin");
      });
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-[#f8fafc]">
        <AdminHeader title="Executive Overview" subtitle="Synchronizing data..." />
        <div className="flex-1 flex flex-col items-center justify-center p-20 animate-pulse">
           <div className="w-16 h-16 bg-primary/5 rounded-[24px] mb-6 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary/10 border-t-gold rounded-full animate-spin" />
           </div>
           <div className="h-4 w-48 bg-primary/5 rounded-full" />
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Content Blogs", count: blogCount, icon: HiOutlinePencilAlt, color: "text-blue-500", bg: "bg-blue-500/5", link: "/admin/blogs" },
    { label: "News Articles", count: newsCount, icon: HiOutlineNewspaper, color: "text-purple-500", bg: "bg-purple-500/5", link: "/admin/news" },
    { label: "Client Inquiries", count: contactCount, icon: HiOutlineMailOpen, color: "text-orange-500", bg: "bg-orange-500/5", link: "/admin/contacts" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <AdminHeader title="Executive Overview" subtitle="Real-time system metrics and management" />

      <main className="p-8">
        {/* Welcome Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 bg-primary rounded-[24px] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5"
        >
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6">
                <span className="bg-gold/20 text-gold px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest border border-gold/10">Enterprise v2.0</span>
             </div>
             <h2 className="text-[36px] font-black tracking-tighter leading-none mb-4 uppercase italic">Command Center</h2>
            <p className="text-white/60 text-[16px] font-medium max-w-[550px] leading-relaxed">
              Consolidated intelligence and management tools for Brightlight Immigration's digital presence.
            </p>
          </div>
          {/* Glass Blobs */}
          <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-gold/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-100px] left-[15%] w-[400px] h-[400px] bg-primary-light/20 rounded-full blur-[120px]" />
        </motion.section>

        {/* Stats Grid */}
        <section className="grid grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={stat.link} className="no-underline group">
                <div className="bg-white rounded-[20px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.02)] border border-primary/5 hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500 shadow-sm`}>
                      <stat.icon size={28} />
                    </div>
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                       <HiOutlineArrowNarrowRight size={20} />
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1.5 opacity-80">{stat.label}</p>
                  <p className="text-[48px] font-black text-primary tracking-tighter leading-none">{stat.count}</p>
                  
                  {/* Decorative faint icon in bg */}
                  <stat.icon size={100} className="absolute -right-4 -bottom-4 text-slate-200/20 transform rotate-12" />
                </div>
              </Link>
            </motion.div>
          ))}
        </section>

        {/* Action Center */}
        <div className="mb-8 flex items-center justify-between">
           <h3 className="text-[22px] font-black text-primary tracking-tight flex items-center gap-4">
             <div className="w-2.5 h-8 bg-gold rounded-full" />
             Strategic Management
           </h3>
           <Link href="/admin/contacts" className="text-[14px] font-bold text-slate-500 hover:text-primary transition-colors no-underline uppercase tracking-widest">
              View Activity Log
           </Link>
        </div>
        
        <section className="grid grid-cols-2 gap-6">
          {[
            { title: "Content Engine", desc: "Craft and deploy deep-dive immigration guides optimized for search authority.", icon: HiOutlinePencilAlt, manage: "/admin/blogs", create: "/admin/blogs/new", label: "Blogs" },
            { title: "News Desk", desc: "Dispatch critical IRCC policy breaking news and regulatory updates.", icon: HiOutlineDuplicate, manage: "/admin/news", create: "/admin/news/new", label: "News" },
          ].map((box, i) => (
            <motion.div 
              key={box.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="bg-white rounded-[24px] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-primary/5 relative group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <box.icon size={24} />
                </div>
                <span className="bg-primary/5 text-primary/80 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/5">{box.label} Domain</span>
              </div>
              
              <h4 className="text-[20px] font-black text-primary mb-3 leading-none uppercase tracking-tight">{box.title}</h4>
              <p className="text-[14px] text-primary/60 font-medium leading-relaxed mb-8 max-w-[320px]">
                {box.desc}
              </p>

              <div className="flex items-center gap-3">
                <Link href={box.manage} className="flex-1 text-center bg-primary text-white font-black py-4 rounded-xl hover:shadow-xl hover:translate-y-[-2px] transition-all no-underline text-[13px] uppercase tracking-widest">
                  Control Panel
                </Link>
                <Link href={box.create} className="w-[60px] flex items-center justify-center bg-gold text-primary font-black py-4 rounded-xl hover:shadow-xl hover:translate-y-[-2px] transition-all no-underline text-[20px]">
                  <HiOutlinePlus />
                </Link>
              </div>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}
