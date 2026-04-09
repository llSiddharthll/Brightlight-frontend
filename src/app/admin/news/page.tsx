"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import Pagination from "@/components/admin/Pagination";
import { motion } from "framer-motion";
import { 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineExternalLink, 
  HiOutlinePlus,
  HiOutlineCalendar,
  HiOutlineGlobe,
  HiOutlineNewspaper
} from "react-icons/hi";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface News {
  _id: string;
  news_heading: string;
  tag_1: string;
  tag_2: string;
  tag_3: string;
  custom_url: string;
  date: string;
}

export default function AdminNewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const getToken = () => localStorage.getItem("bl_admin_token");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin");
      return;
    }

    setLoading(true);
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return fetch(`${API}/api/news?page=${page}&limit=10`);
      })
      .then((r) => r.json())
      .then((data) => {
        setNews(data.news || []);
        setTotalPages(data.pages || 1);
        setTotalCount(data.total || 0);
        setLoading(false);
      })
      .catch(() => {
        router.replace("/admin");
      });
  }, [router, page]);

  const handleDelete = async (id: string, heading: string) => {
    if (!window.confirm(`Force purge news article: "${heading}"?`)) return;

    const token = getToken();
    if (!token) return;

    setDeleting(id);
    setError("");

    try {
      const res = await fetch(`${API}/api/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Purge operation failed");
      setNews((prev) => prev.filter((b) => b._id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <AdminHeader 
        title="Intelligence Desk" 
        subtitle={`RECORDS: ${totalCount} Immigration Bulletins Active`} 
      />

      <main className="p-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        {/* Newsroom Action Console */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-primary/5">
          <h2 className="text-[22px] font-black text-primary flex items-center gap-4 tracking-tighter leading-none">
            <div className="w-1.5 h-8 bg-gold rounded-full" />
            Policy Newsroom
          </h2>
          <Link
            href="/admin/news/new"
            className="group bg-primary text-white pl-8 pr-10 py-4 rounded-xl text-[13px] font-black no-underline hover:shadow-2xl hover:translate-y-[-2px] transition-all duration-300 flex items-center gap-3 uppercase tracking-widest"
          >
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-gold group-hover:text-primary transition-colors">
               <HiOutlinePlus size={18} />
            </div>
            Dispatch News
          </Link>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-[28px] px-8 py-5 text-[14px] text-red-500 mb-8 font-black uppercase tracking-widest flex items-center gap-3"
          >
            <span className="text-[20px]">⚠️</span> Database Collision: {error}
          </motion.div>
        )}

        {loading ? (
          <div className="bg-white rounded-[40px] p-32 text-center shadow-[0_8px_50px_rgba(0,0,0,0.03)] border border-primary/5">
            <div className="w-16 h-16 border-[6px] border-primary/5 border-t-gold rounded-full animate-spin mx-auto mb-8" />
            <p className="text-primary/20 font-black uppercase tracking-[0.3em]">Querying Bulletin Board...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white rounded-[40px] p-32 text-center shadow-[0_8px_50px_rgba(0,0,0,0.03)] border border-primary/5">
            <div className="w-20 h-20 bg-primary/5 rounded-[30px] flex items-center justify-center mx-auto mb-8 text-primary/10">
               <HiOutlineNewspaper size={48} />
            </div>
            <p className="text-primary/30 text-[20px] font-black tracking-tight mb-8">No broadcasts detected in the matrix.</p>
            <Link href="/admin/news/new" className="bg-primary text-white px-10 py-5 rounded-2xl font-black no-underline uppercase tracking-widest hover:shadow-xl transition-all">
              Initialize First Broadcast
            </Link>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(19,47,70,0.03)] border border-primary/5 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/[0.03] border-b border-primary/10">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Bulletin Header</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] max-[700px]:hidden">Tags</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] max-[900px]:hidden">Broadcast Date</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {news.map((item, i) => (
                    <motion.tr 
                      key={item._id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-primary/[0.01] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <p className="text-[16px] font-black text-primary group-hover:text-primary-light transition-colors leading-tight mb-1.5 tracking-tight">
                          {item.news_heading}
                        </p>
                        <div className="flex items-center gap-2 mt-1 opacity-80">
                           <HiOutlineGlobe className="text-gold" size={14} />
                           <p className="text-[11px] text-slate-600 font-bold font-mono lowercase tracking-tighter">/news/{item.custom_url || item._id}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 max-[700px]:hidden">
                        <div className="flex flex-wrap gap-2">
                          {[item.tag_1, item.tag_2, item.tag_3].filter(Boolean).map((t) => (
                            <span key={t} className="text-[9px] uppercase tracking-widest bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-black border border-slate-200">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-6 max-[900px]:hidden whitespace-nowrap">
                        <div className="flex items-center gap-2.5 opacity-80">
                           <HiOutlineCalendar className="text-slate-500" size={17} />
                           <p className="text-[13px] text-slate-600 font-black uppercase tracking-widest italic">
                              {item.date ? new Date(item.date).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }) : "STANDBY"}
                           </p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 relative">
                            <Link href={`/news/${item.custom_url || item._id}`} target="_blank" className="w-10 h-10 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all hover:shadow-lg border border-slate-200 no-underline shadow-sm">
                              <HiOutlineExternalLink size={18} />
                            </Link>
                            <Link href={`/admin/news/${item._id}/edit`} className="w-10 h-10 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-gold hover:bg-white rounded-lg transition-all hover:shadow-lg border border-slate-200 no-underline shadow-sm">
                              <HiOutlinePencil size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(item._id, item.news_heading)}
                              disabled={deleting === item._id}
                              className="w-10 h-10 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all hover:shadow-lg border border-slate-200 disabled:opacity-50 shadow-sm"
                            >
                              <HiOutlineTrash size={18} />
                            </button>
                         </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-5 bg-primary/[0.01] border-t border-primary/5">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalCount}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
