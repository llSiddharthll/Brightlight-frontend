"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Pagination from "@/components/admin/Pagination";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlineSearch, 
  HiOutlineFolder, 
  HiOutlineRefresh, 
  HiOutlineTrash, 
  HiOutlineChatAlt2,
  HiOutlineMail,
  HiOutlineIdentification,
  HiOutlineReply,
  HiOutlineEye,
  HiOutlineExternalLink
} from "react-icons/hi";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  areaOfInterest?: string;
  residencyStatus?: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function ContactsAdminPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterCategory, setFilterCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchContacts = async () => {
    const token = localStorage.getItem("bl_admin_token");
    if (!token) {
      router.replace("/admin");
      return;
    }

    try {
      setLoading(true);
      const url = new URL(`${API}/api/contacts`);
      url.searchParams.append("page", page.toString());
      if (filterCategory) url.searchParams.append("category", filterCategory);
      if (searchQuery) url.searchParams.append("search", searchQuery);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (res.ok) {
        setContacts(data.contacts || []);
        setTotal(data.total || 0);
        setTotalPages(data.pages || 1);
      } else {
        toast.error(data.error || "Execution error in fetch");
      }
    } catch (err) {
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, filterCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchContacts();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Purge record from ${name}?`)) return;

    const token = localStorage.getItem("bl_admin_token");
    setDeleting(id);
    try {
      const res = await fetch(`${API}/api/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Record purged");
        fetchContacts();
      }
    } catch (err) {
      toast.error("Internal server error");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Toaster position="top-right" />
      <AdminHeader title="Intelligence & CRM" subtitle={`DATABASE: ${total} Total Client Records`} />

      <main className="p-8 h-screen overflow-hidden flex flex-col">
        {/* Unified Filter Console */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[20px] p-6 mb-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-primary/5 flex items-center justify-between flex-wrap gap-6"
        >
          <div className="flex items-center gap-6 flex-wrap">
             <form onSubmit={handleSearch} className="relative group">
                <HiOutlineSearch className="absolute left-6 top-1/2 translate-y-[-50%] text-primary/40 group-hover:text-gold transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search Name or Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-8 py-4 rounded-xl border border-primary/5 bg-[#f8fafc] text-[14px] font-bold text-primary focus:bg-white focus:border-gold outline-none transition-all w-[340px] shadow-sm"
                />
             </form>

             <div className="h-10 w-px bg-primary/5" />

             <div className="relative group">
                <HiOutlineFolder className="absolute left-6 top-1/2 translate-y-[-50%] text-primary/40 group-hover:text-gold transition-colors" size={20} />
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setPage(1);
                  }}
                  className="pl-14 pr-10 py-4 rounded-xl border border-primary/5 bg-[#f8fafc] text-[14px] font-black text-primary focus:bg-white focus:border-gold outline-none transition-all appearance-none cursor-pointer min-w-[200px] shadow-sm"
                >
                  <option value="">All Categories</option>
                  <option value="Express Entry">Express Entry</option>
                  <option value="PNP">PNP</option>
                  <option value="Study Visa">Study Visa</option>
                  <option value="Visitor Visa">Visitor Visa</option>
                </select>
             </div>
          </div>

          <button 
            onClick={() => fetchContacts()} 
            className="w-14 h-14 bg-primary text-white flex items-center justify-center rounded-[20px] hover:shadow-xl hover:rotate-180 transition-all duration-700 active:scale-95"
          >
             <HiOutlineRefresh size={22} />
          </button>
        </motion.div>

        <div className="flex gap-10 items-start flex-1 overflow-hidden min-h-0">
          {/* Record Matrix */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 bg-white rounded-2xl shadow-[0_10px_40px_rgba(19,47,70,0.03)] border border-primary/5 overflow-hidden flex flex-col"
          >
            <div className="flex-1 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/[0.03] border-b border-primary/10">
                    <th className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Contact Identity</th>
                    <th className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment Logic</th>
                    <th className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Timestamp</th>
                    <th className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {loading ? (
                    <tr><td colSpan={4} className="px-10 py-24 text-center text-primary/10 font-bold uppercase tracking-widest italic animate-pulse">Synchronizing Records...</td></tr>
                  ) : contacts.length === 0 ? (
                    <tr><td colSpan={4} className="px-10 py-24 text-center text-primary/10 font-bold uppercase tracking-widest italic">Matrix is Empty</td></tr>
                  ) : (
                    contacts.map((contact, i) => (
                      <motion.tr
                        key={contact._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedContact(contact)}
                        className={`cursor-pointer transition-all hover:bg-primary/[0.01] group ${selectedContact?._id === contact._id ? "bg-gold/5" : ""}`}
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors border border-slate-200 shadow-sm">
                                <HiOutlineChatAlt2 size={20} />
                             </div>
                             <div>
                                <p className="text-[14px] font-black text-primary mb-0.5">{contact.name}</p>
                                <p className="text-[11px] text-slate-600 font-bold lowercase tracking-tight">{contact.email}</p>
                             </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-[10px] font-black uppercase text-gold bg-gold/5 px-2.5 py-1 rounded-md border border-gold/10 inline-flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                            {contact.areaOfInterest || "General"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-[12px] text-slate-600 font-bold whitespace-nowrap">
                          {new Date(contact.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-all duration-300">
                            <button
                              onClick={(e) => { e.stopPropagation(); window.open(`mailto:${contact.email}`); }}
                              className="w-9 h-9 bg-slate-50 flex items-center justify-center text-slate-500 hover:text-gold hover:bg-white rounded-lg transition-all border border-slate-200 shadow-sm"
                              title="Compose Draft"
                            >
                              <HiOutlineMail size={17} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(contact._id, contact.name); }}
                              disabled={deleting === contact._id}
                              className="w-9 h-9 bg-slate-50 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-slate-200 disabled:opacity-50 shadow-sm"
                              title="Terminate Log"
                            >
                              <HiOutlineTrash size={17} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-primary/[0.01] border-t border-primary/5">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          </motion.div>

          {/* Detailed Intelligence Sidebar */}
          <AnimatePresence mode="wait">
            {selectedContact ? (
              <motion.div 
                key={selectedContact._id}
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.95 }}
                className="w-[450px] bg-white rounded-2xl shadow-[0_15px_60px_rgba(19,47,70,0.1)] border border-primary/5 flex flex-col overflow-hidden max-h-[85vh] sticky top-[130px]"
              >
                  <div className="p-8 border-b border-primary/5 bg-primary text-white relative">
                     <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-white mb-4 shadow-xl">
                        <HiOutlineIdentification size={26} />
                     </div>
                     <h3 className="text-[22px] font-black tracking-tighter uppercase italic">Record Intel</h3>
                     <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mt-1">UUID: {selectedContact._id}</p>
                     
                     <button 
                       onClick={() => setSelectedContact(null)}
                       className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
                     >
                        ✕
                     </button>
                  </div>
                  
                  <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                     <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Sender</p>
                          <p className="text-[15px] font-black text-primary tracking-tight">{selectedContact.name}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Category</p>
                          <p className="text-[15px] font-black text-gold tracking-tight">{selectedContact.areaOfInterest || "General Inquiry"}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Residency</p>
                          <p className="text-[15px] font-black text-primary tracking-tight">{selectedContact.residencyStatus || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Timestamp</p>
                          <p className="text-[15px] font-black text-slate-600 tracking-tight">{new Date(selectedContact.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>

                     <div className="bg-[#f8fafc] rounded-2xl p-6 border border-primary/5">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Contact Info</p>
                        <div className="space-y-4">
                           <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.open(`mailto:${selectedContact.email}`)}>
                              <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-primary-light group-hover:text-primary transition-colors">
                                 <HiOutlineMail size={20} />
                              </div>
                              <div>
                                 <p className="text-[14px] font-black text-primary">{selectedContact.email}</p>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Primary Email</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-primary-light">
                                 <HiOutlineExternalLink size={20} />
                              </div>
                              <div>
                                 <p className="text-[14px] font-black text-primary">{selectedContact.phone || "Not Provided"}</p>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Phone Archive</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Message Payload</p>
                        <div className="bg-[#f8fafc] border border-primary/5 rounded-2xl p-6 text-[15px] leading-[1.6] text-primary/80 font-medium italic relative">
                           <span className="absolute top-2 left-4 text-[32px] text-primary/5 font-serif italic">"</span>
                           {selectedContact.message}
                        </div>
                     </div>
                  </div>

                  <div className="p-8 bg-primary/[0.02] border-t border-primary/5">
                     <button
                        onClick={() => window.open(`mailto:${selectedContact.email}?subject=Regarding your inquiry on Brightlight Immigration`)}
                        className="w-full bg-primary text-white font-black py-4 rounded-xl hover:shadow-xl hover:translate-y-[-2px] transition-all text-[13px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                     >
                        <HiOutlineReply size={18} />
                        Establish Reply
                     </button>
                  </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-[480px] flex-1 flex flex-col items-center justify-center p-20 text-center opacity-10"
              >
                  <div className="w-24 h-24 bg-primary/20 rounded-[40px] flex items-center justify-center text-[40px] mb-8">
                     <HiOutlineEye size={48} />
                  </div>
                  <p className="font-black text-[18px] text-primary uppercase tracking-[0.2em]">Matrix Hub Ready</p>
                  <p className="text-[13px] font-bold mt-4 uppercase tracking-widest">Select a record to decrypt details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
