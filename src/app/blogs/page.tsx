"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Loader from "@/components/ui/loader";

function makeSlug(heading: string) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "");
}

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
  date: string;
}

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const PER_PAGE = 6;

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`${API}/api/blogs`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data);
        } else {
          console.error("Blogs data is not an array:", data);
          setBlogs([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch blogs:", err);
        setBlogs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const featured = Array.isArray(blogs) ? blogs[0] ?? null : null;

  const filtered = useMemo(() => {
    let list = Array.isArray(blogs) ? [...blogs] : [];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.blog_heading.toLowerCase().includes(q) ||
          (b.tag_1 || "").toLowerCase().includes(q) ||
          (b.tag_2 || "").toLowerCase().includes(q) ||
          (b.tag_3 || "").toLowerCase().includes(q)
      );
    }
    if (sort === "oldest") list.reverse();
    return list;
  }, [blogs, search, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const recent = blogs.slice(0, 5);


  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleSort = (val: "newest" | "oldest") => {
    setSort(val);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">

      {/* ── Top banner ── */}
      <div className="bg-primary pt-[200px] max-[1000px]:pt-[200px] max-[580px]:pt-[190px] pb-16 max-[580px]:pb-10 px-6 max-[580px]:px-4">
        <div className="max-w-[1440px] max-[1460px]:max-w-[95%] mx-auto">
          <p className="text-gold text-[13px] font-semibold uppercase tracking-widest mb-3">
            Brightlight Blog
          </p>
          <h1 className="text-white text-[52px] max-[800px]:text-[36px] max-[480px]:text-[28px] font-bold leading-tight mb-4">
            Immigration Insights &amp; Updates
          </h1>
          <p className="text-white/60 text-[17px] max-[580px]:text-[15px] max-w-[560px]">
            Your go-to source for easy-to-understand Canadian immigration news,
            tips, and policy updates.
          </p>
        </div>
      </div>

      {/* ── Featured latest blog ── */}
      {featured && !loading && (
        <div className="max-w-[1440px] max-[1460px]:max-w-[95%] mx-auto px-6 max-[580px]:px-3 -mt-8 max-[580px]:-mt-5">
          <Link
            href={`/blogs/${featured.custom_url || makeSlug(featured.blog_heading)}`}
            className="no-underline group block"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(19,47,70,0.14)] flex flex-col md:flex-row">
              {featured.image && (
                <div className="md:w-[55%] aspect-[16/9] md:aspect-auto overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.image}
                    alt={featured.alt_tag || featured.blog_heading}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <div className="md:w-[45%] p-6 max-[580px]:p-5 md:p-12 flex flex-col justify-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gold mb-4 block">
                  Featured Post
                </span>
                {featured.tag_1 && (
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-gold bg-gold/10 px-2.5 py-1 rounded-full mb-3 w-fit">
                    {featured.tag_1}
                  </span>
                )}
                <h2 className="text-primary text-[26px] max-[600px]:text-[20px] font-bold leading-snug mb-4 group-hover:text-gold transition-colors duration-200">
                  {featured.blog_heading}
                </h2>
                {featured.blog_content && (
                  <p className="text-[#4a4a4a] text-[15px] leading-relaxed mb-6 line-clamp-3">
                    {stripHtml(featured.blog_content).slice(0, 200)}…
                  </p>
                )}
                {featured.date && (
                  <p className="text-[12px] text-primary/40 mb-6">
                    {new Date(featured.date).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                <span className="inline-flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg w-fit group-hover:bg-gold transition-colors duration-200">
                  Read Article →
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ── Search + sort bar ── */}
      <div className="max-w-[1440px] max-[1460px]:max-w-[95%] mx-auto px-6 max-[580px]:px-3 mt-10 max-[580px]:mt-6">
        <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(19,47,70,0.07)] px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-[420px]">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search blogs…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full border border-primary/20 rounded-lg pl-10 pr-4 py-2 text-[14px] text-primary focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/50 transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 text-[15px]">
                🔍
              </span>
            </div>
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="text-[12px] text-primary/50 hover:text-primary transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-primary/50">Sort:</span>
            {(["newest", "oldest"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => handleSort(opt)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                  sort === opt
                    ? "bg-primary text-white"
                    : "bg-primary/5 text-primary hover:bg-primary/10"
                }`}
              >
                {opt}
              </button>
            ))}
            <span className="text-primary/30 ml-2 text-[12px]">
              {filtered.length} post{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content + sidebar ── */}
      <div className="max-w-[1440px] max-[1460px]:max-w-[95%] mx-auto px-6 max-[580px]:px-3 py-10 max-[580px]:py-6 flex gap-8 max-[580px]:gap-5 items-start flex-col lg:flex-row">

        {/* Blog grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <Loader />
          ) : paginated.length === 0 ? (
            <div className="text-center py-20 text-primary/40 text-[16px]">
              {search ? `No blogs found for "${search}"` : "No blogs published yet."}
            </div>
          ) : (
            <div className="grid grid-cols-2 max-[700px]:grid-cols-1 gap-6">
              {paginated.map((blog) => {
                const slug = blog.custom_url || makeSlug(blog.blog_heading);
                const tags = [blog.tag_1, blog.tag_2, blog.tag_3].filter(Boolean);
                const excerpt = blog.blog_content ? stripHtml(blog.blog_content).slice(0, 120) : "";
                const dateStr = blog.date
                  ? new Date(blog.date).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "";
                return (
                  <Link
                    key={blog._id}
                    href={`/blogs/${slug}`}
                    className="no-underline group"
                  >
                    <article className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(19,47,70,0.07)] hover:shadow-[0_8px_32px_rgba(19,47,70,0.13)] transition-all duration-300 h-full flex flex-col">
                      {blog.image ? (
                        <div className="aspect-[16/9] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={blog.image}
                            alt={blog.alt_tag || blog.blog_heading}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-gold/10 flex items-center justify-center">
                          <span className="text-primary/20 text-[40px]">📰</span>
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <h2 className="text-primary text-[16px] font-bold leading-snug mb-2 group-hover:text-gold transition-colors duration-200 line-clamp-2">
                          {blog.blog_heading}
                        </h2>
                        {excerpt && (
                          <p className="text-[#4a4a4a] text-[13px] leading-relaxed mb-3 flex-1 line-clamp-3">
                            {excerpt}…
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-primary/8">
                          {dateStr && (
                            <span className="text-[11px] text-primary/40">{dateStr}</span>
                          )}
                          <span className="text-[12px] text-gold font-semibold group-hover:gap-2 transition-all">
                            Read more →
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg text-[13px] font-medium text-primary bg-white border border-primary/15 hover:bg-primary/5 disabled:opacity-30 transition-colors cursor-pointer"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${
                    page === n
                      ? "bg-primary text-white"
                      : "bg-white text-primary border border-primary/15 hover:bg-primary/5"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 rounded-lg text-[13px] font-medium text-primary bg-white border border-primary/15 hover:bg-primary/5 disabled:opacity-30 transition-colors cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[300px] shrink-0 flex flex-col gap-6">

          {/* Recent posts */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(19,47,70,0.07)] p-6">
            <h3 className="text-[16px] font-bold text-primary mb-4 pb-3 border-b border-primary/10">
              Recent Posts
            </h3>
            <div className="flex flex-col gap-4">
              {recent.map((b) => {
                const slug = b.custom_url || makeSlug(b.blog_heading);
                const dateStr = b.date
                  ? new Date(b.date).toLocaleDateString("en-CA", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "";
                return (
                  <Link
                    key={b._id}
                    href={`/blogs/${slug}`}
                    className="no-underline group flex gap-3 items-start"
                  >
                    {b.image && (
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={b.image}
                          alt={b.blog_heading}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-primary group-hover:text-gold transition-colors duration-200 line-clamp-2 leading-snug">
                        {b.blog_heading}
                      </p>
                      {dateStr && (
                        <p className="text-[11px] text-primary/40 mt-1">{dateStr}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
              {!loading && recent.length === 0 && (
                <p className="text-[13px] text-primary/40">No posts yet.</p>
              )}
            </div>
          </div>

          {/* Free Assessment CTA */}
          <div className="bg-primary rounded-2xl p-6 text-white text-center">
            <div className="text-[32px] mb-3">🇨🇦</div>
            <h3 className="text-[18px] font-bold mb-2">Start Your Process Today!</h3>
            <p className="text-white/70 text-[13px] mb-5">
              Book a free assessment with our immigration experts and take the
              first step toward your Canadian dream.
            </p>
            <Link
              href="/booking"
              className="inline-block bg-gold text-primary font-semibold px-6 py-2.5 rounded-lg text-[14px] hover:bg-gold/90 transition-colors duration-200 no-underline"
            >
              Free Assessment
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
