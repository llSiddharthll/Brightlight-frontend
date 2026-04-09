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
  HiOutlineArrowLeft,
  HiOutlineSave
} from "react-icons/hi";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Blog {
  _id: string;
  blog_heading: string;
  blog_content: string;
  image: string;
  tag_1: string;
  tag_2: string;
  tag_3: string;
  custom_url: string;
  alt_tag: string;
  metaTitle: string;
  metaDescription: string;
  date: string;
}

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [blogId, setBlogId] = useState("");
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [tag1, setTag1] = useState("");
  const [tag2, setTag2] = useState("");
  const [tag3, setTag3] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [altTag, setAltTag] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("bl_admin_token");
      if (!token) { router.replace("/admin"); return; }

      const { id } = await params;
      setBlogId(id);

      try {
        const meRes = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) { router.replace("/admin"); return; }

        let blog: Blog | null = null;
        const byId = await fetch(`${API}/api/blogs/${id}`);
        if (byId.ok) {
          blog = await byId.json();
        }

        if (!blog) { setNotFound(true); setLoading(false); return; }

        setHeading(blog.blog_heading || "");
        setContent(blog.blog_content || "");
        setTag1(blog.tag_1 || "");
        setTag2(blog.tag_2 || "");
        setTag3(blog.tag_3 || "");
        setCustomUrl(blog.custom_url || "");
        setAltTag(blog.alt_tag || "");
        setMetaTitle(blog.metaTitle || "");
        setMetaDesc(blog.metaDescription || "");
        setExistingImage(blog.image || "");
        setLoading(false);
      } catch {
        router.replace("/admin");
      }
    };
    init();
  }, [router, params]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!heading.trim()) { setError("Blog heading is required."); return; }
    if (!content.trim()) { setError("Content is required."); return; }

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

      const res = await fetch(`${API}/api/blogs/${blogId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }

      router.replace("/admin/blogs");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update blog");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-[#f8fafc]">
        <AdminHeader title="Editing Content" subtitle="Loading blog details..." />
        <div className="flex-1 flex flex-col items-center justify-center p-20 animate-pulse">
           <div className="w-12 h-12 bg-primary/10 rounded-full mb-4" />
           <div className="h-4 w-32 bg-primary/10 rounded" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col h-full bg-[#f8fafc]">
        <AdminHeader title="Error 404" />
        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
          <p className="text-[18px] text-primary/30 font-bold mb-6">Blog record not found in database.</p>
          <Link href="/admin/blogs" className="bg-primary text-white px-8 py-4 rounded-xl font-bold no-underline">
            ← Browse Blogs
          </Link>
        </div>
      </div>
    );
  }

  const displayImage = imagePreview || existingImage;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <AdminHeader title="Edit Blog Post" subtitle={`Modifying: ${heading}`} />

      <main className="p-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 overflow-x-hidden">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin/blogs"
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200 hover:border-gold transition-all no-underline text-primary"
          >
            <HiOutlineArrowLeft />
          </Link>
          <div className="h-4 w-px bg-slate-300 mx-2" />
          <p className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">Library / Edit Record</p>
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
                      className="w-full bg-[#f8fafc] border border-primary/10 rounded-xl px-4 py-2.5 text-[14px] font-bold text-primary focus:bg-white focus:border-gold outline-none transition-all"
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
                Update Settings
              </h3>
              
              <div className="space-y-4 mb-6">
                 <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5">URL Logic</label>
                    <input
                      type="text"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[13px] font-bold text-gold focus:bg-white/10 focus:border-gold outline-none transition-all font-mono"
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
                    <HiOutlineSave size={18} />
                    Save Changes
                  </>
                )}
              </button>
              <Link href="/admin/blogs" className="block text-center mt-4 text-[11px] text-white/40 hover:text-white transition-colors no-underline uppercase tracking-[0.2em] font-black">
                Revert Changes
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
                   {displayImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={displayImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
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
                   <div className="absolute inset-x-0 bottom-0 bg-primary/80 backdrop-blur-sm p-3 text-center translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Click to Replace Image</p>
                   </div>
                </div>

                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Accessibility (Alt)</label>
                   <input
                     type="text"
                     value={altTag}
                     onChange={(e) => setAltTag(e.target.value)}
                     className="w-full bg-[#f8fafc] border border-primary/10 rounded-xl px-4 py-2.5 text-[13px] font-bold text-primary focus:bg-white focus:border-gold outline-none transition-all placeholder:text-slate-400"
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
