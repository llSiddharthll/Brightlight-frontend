"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import ContentEditor from "@/components/admin/ContentEditor";
import { 
  HiOutlineCloudUpload, 
  HiOutlinePhotograph, 
  HiOutlineExclamationCircle,
  HiOutlineTrash,
  HiOutlineArrowLeft,
  HiOutlineSave
} from "react-icons/hi";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function NewBlogPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [tag1, setTag1] = useState("");
  const [tag2, setTag2] = useState("");
  const [tag3, setTag3] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [altTag, setAltTag] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("bl_admin_token");
    if (!token) {
      router.replace("/admin");
      return;
    }
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => {
      if (!r.ok) router.replace("/admin");
    });
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!heading.trim()) {
      setError("Blog heading is required.");
      return;
    }
    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    const token = localStorage.getItem("bl_admin_token");
    if (!token) { router.replace("/admin"); return; }

    setSubmitting(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("blog_heading", heading.trim());
      fd.append("blog_content", content);
      fd.append("tag_1", tag1.trim());
      fd.append("tag_2", tag2.trim());
      fd.append("tag_3", tag3.trim());
      fd.append("custom_url", customUrl.trim());
      fd.append("alt_tag", altTag.trim());
      fd.append("metaTitle", metaTitle.trim());
      fd.append("metaDescription", metaDesc.trim());
      if (imageFile) fd.append("image", imageFile);

      const res = await fetch(`${API}/api/blogs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }

      router.replace("/admin/blogs");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <AdminHeader title="Create New Blog" subtitle="Crafting a new story for Brightlight Immigration" />

      <main className="p-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 overflow-x-hidden">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin/blogs"
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200 hover:border-gold transition-all no-underline text-primary"
          >
            <HiOutlineArrowLeft />
          </Link>
          <div className="h-4 w-px bg-slate-300 mx-2" />
          <p className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">Library / New Entry</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-10 items-start">
          {error && (
            <div className="col-span-12 bg-red-50 border border-red-100 rounded-2xl px-6 py-3 text-[14px] text-red-600 font-bold mb-6 flex items-center gap-3">
              <HiOutlineExclamationCircle size={20} />
              {error}
            </div>
          )}

          {/* Left Column: Editor & Details */}
          <div className="col-span-8 space-y-6">
            {/* Heading & Tags */}
            <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_40px_rgba(19,47,70,0.03)] border border-primary/10">
              <div className="mb-8">
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-600 mb-2.5">Blog Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  required
                  className="w-full bg-[#f8fafc] border border-primary/10 rounded-xl px-6 py-4 text-[16px] font-bold text-primary focus:bg-white focus:border-gold outline-none transition-all placeholder:text-slate-400"
                  placeholder="The Ultimate Guide to Express Entry 2026..."
                />
              </div>

              <div className="grid grid-cols-3 gap-5">
                {[
                  { label: "Category 1", val: tag1, set: setTag1 },
                  { label: "Category 2", val: tag2, set: setTag2 },
                  { label: "Category 3", val: tag3, set: setTag3 },
                ].map(({ label, val, set }) => (
                  <div key={label}>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">{label}</label>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-primary/10 rounded-xl px-4 py-2.5 text-[14px] font-bold text-primary focus:bg-white focus:border-gold outline-none transition-all placeholder:text-slate-400"
                      placeholder="e.g. Canada PR"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Rich Content Editor */}
            <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_40px_rgba(19,47,70,0.03)] border border-primary/10">
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-600 mb-4">Main Content Body <span className="text-red-400">*</span></label>
              <ContentEditor
                value={content}
                onChange={setContent}
                label=""
              />
            </div>
          </div>

          {/* Right Column: SEO & Settings */}
          <div className="col-span-4 space-y-6">
            {/* Publishing Settings */}
            <div className="bg-primary rounded-[20px] p-6 text-white shadow-xl">
              <h3 className="text-[16px] font-bold mb-5 flex items-center gap-2">
                <HiOutlineCloudUpload size={20} />
                Publish Settings
              </h3>
              
              <div className="space-y-4 mb-6">
                 <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5">URL Logic</label>
                    <input
                      type="text"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[13px] font-bold text-gold focus:bg-white/10 focus:border-gold outline-none transition-all font-mono placeholder:text-white/20"
                      placeholder="auto-generated..."
                    />
                 </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gold text-primary font-black py-4 rounded-xl hover:shadow-xl hover:translate-y-[-2px] transition-all text-[13px] uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? "Processing..." : (
                  <>
                    <HiOutlineCloudUpload size={18} />
                    Publish Live
                  </>
                )}
              </button>
              <Link href="/admin/blogs" className="block text-center mt-4 text-[11px] text-white/40 hover:text-white transition-colors no-underline uppercase tracking-[0.2em] font-black">
                Discard Draft
              </Link>
            </div>

            {/* Image Manager */}
            <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_40px_rgba(19,47,70,0.03)] border border-primary/10">
              <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-700 mb-4 border-b border-primary/10 pb-3 flex items-center gap-2">
                <HiOutlinePhotograph size={18} />
                Featured Image
              </h3>
              
              <div className="space-y-4">
                <div className="aspect-video bg-[#f8fafc] rounded-xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                   {imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                   ) : (
                      <div className="text-center flex flex-col items-center">
                         <HiOutlinePhotograph size={28} className="text-slate-300 mb-2" />
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Upload Header Image</p>
                      </div>
                   )}
                   <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/*"
                     onChange={handleImageChange}
                     className="absolute inset-0 opacity-0 cursor-pointer"
                   />
                </div>

                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Accessibility (Alt)</label>
                   <input
                     type="text"
                     value={altTag}
                     onChange={(e) => setAltTag(e.target.value)}
                     className="w-full bg-[#f8fafc] border border-primary/10 rounded-xl px-4 py-2.5 text-[13px] font-bold text-primary focus:bg-white focus:border-gold outline-none transition-all placeholder:text-slate-400"
                     placeholder="SEO description"
                   />
                </div>
              </div>
            </div>

            {/* SEO Optimization */}
            <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_40px_rgba(19,47,70,0.03)] border border-primary/10">
              <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-700 mb-4 border-b border-primary/10 pb-3 flex items-center gap-2">
                <HiOutlineSave size={18} />
                SEO Metadata
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Meta Title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-primary/10 rounded-xl px-4 py-2.5 text-[13px] font-bold text-primary focus:bg-white focus:border-gold outline-none transition-all placeholder:text-slate-400"
                    placeholder="Search Engine Title"
                  />
                  <div className="h-1 bg-gold/10 rounded-full mt-2 overflow-hidden">
                     <div className="h-full bg-gold transition-all" style={{ width: `${Math.min((metaTitle.length / 60) * 100, 100)}%` }} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Meta Description</label>
                  <textarea
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-[#f8fafc] border border-primary/10 rounded-xl px-4 py-2.5 text-[13px] font-bold text-primary focus:bg-white focus:border-gold outline-none transition-all resize-none placeholder:text-slate-400"
                    placeholder="Search result snippet..."
                  />
                  <div className="h-1 bg-gold/10 rounded-full mt-2 overflow-hidden">
                     <div className="h-full bg-gold transition-all" style={{ width: `${Math.min((metaDesc.length / 160) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
