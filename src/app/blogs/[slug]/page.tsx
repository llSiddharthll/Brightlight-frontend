import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

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

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function makeSlug(heading: string) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${API}/api/blogs/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getAllBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(`${API}/api/blogs`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Blog Not Found" };
  return {
    title: blog.metaTitle || blog.blog_heading,
    description:
      blog.metaDescription ||
      blog.blog_content?.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [blog, allBlogs] = await Promise.all([getBlog(slug), getAllBlogs()]);
  if (!blog) notFound();

  const dateStr = blog.date
    ? new Date(blog.date).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const tags = [blog.tag_1, blog.tag_2, blog.tag_3].filter(Boolean);
  const recentBlogs = allBlogs
    .filter((b) => b._id !== blog._id)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f5f7fa]">

      {/* ── Title banner ── */}
      <div className="bg-primary pt-[200px] max-[1000px]:pt-[200px] max-[580px]:pt-[190px] pb-12 max-[580px]:pb-8 px-6 max-[580px]:px-4">
        <div className="max-w-[1440px] max-[1460px]:max-w-[95%] mx-auto">
          <Link
            href="/blogs"
            className="hidden md:inline-flex items-center gap-1.5 text-white/50 hover:text-white text-[13px] no-underline mb-6 transition-colors duration-200"
          >
            ← Back to Blogs
          </Link>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-bold uppercase tracking-widest text-gold bg-gold/15 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-white text-[40px] max-[700px]:text-[28px] max-[480px]:text-[24px] font-bold leading-tight max-w-[860px]">
            {blog.blog_heading}
          </h1>
          {dateStr && (
            <p className="text-white/50 text-[14px] mt-4 max-[580px]:mt-3">
              Published {dateStr}
            </p>
          )}
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="max-w-[1440px] max-[1460px]:max-w-[95%] mx-auto px-6 max-[580px]:px-3 py-10 max-[580px]:py-6 flex gap-8 max-[580px]:gap-5 items-start flex-col lg:flex-row">

        {/* ── Main content ── */}
        <article className="flex-1 min-w-0 w-full">

          {/* Featured image */}
          {blog.image && (
            <div className="rounded-2xl max-[580px]:rounded-xl overflow-hidden mb-8 max-[580px]:mb-5 shadow-[0_4px_24px_rgba(19,47,70,0.10)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blog.image}
                alt={blog.alt_tag || blog.blog_heading}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="bg-white rounded-2xl max-[580px]:rounded-xl shadow-[0_4px_20px_rgba(19,47,70,0.07)] px-8 max-[580px]:px-4 py-10 max-[580px]:py-6">
            <div
              className="
                prose prose-lg max-w-none
                [&_h2]:text-[28px] [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:leading-snug
                [&_h3]:text-[22px] [&_h3]:font-semibold [&_h3]:text-primary [&_h3]:mt-8 [&_h3]:mb-3
                [&_h4]:text-[18px] [&_h4]:font-semibold [&_h4]:text-primary [&_h4]:mt-6 [&_h4]:mb-2
                [&_p]:text-[16px] [&_p]:leading-[1.85] [&_p]:text-[#3a3a3a] [&_p]:mb-5
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5
                [&_li]:mb-2 [&_li]:text-[16px] [&_li]:text-[#3a3a3a] [&_li]:leading-relaxed
                [&_a]:text-gold [&_a]:no-underline [&_a:hover]:text-primary [&_a:hover]:underline
                [&_strong]:text-primary [&_strong]:font-semibold
                [&_em]:italic
                [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:bg-gold/5 [&_blockquote]:pl-5 [&_blockquote]:pr-4 [&_blockquote]:py-3 [&_blockquote]:italic [&_blockquote]:text-primary/70 [&_blockquote]:my-6 [&_blockquote]:rounded-r-lg
                [&_hr]:border-primary/10 [&_hr]:my-8
                [&_code]:bg-primary/5 [&_code]:text-primary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[14px] [&_code]:font-mono
                [&_pre]:bg-primary/5 [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:my-6 [&_pre]:overflow-x-auto
                [&_img]:rounded-xl [&_img]:my-6 [&_img]:w-full [&_img]:shadow-[0_4px_16px_rgba(19,47,70,0.10)]
                [&_mark]:bg-yellow-100 [&_mark]:rounded-sm [&_mark]:px-0.5
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-6
                [&_th]:bg-primary [&_th]:text-white [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:text-[14px]
                [&_td]:border [&_td]:border-primary/10 [&_td]:px-4 [&_td]:py-2 [&_td]:text-[15px]
              "
              dangerouslySetInnerHTML={{ __html: blog.blog_content }}
            />
          </div>

          {/* Back link — hidden on mobile */}
          <div className="mt-8 hidden md:block">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-primary/50 hover:text-primary text-[14px] no-underline transition-colors duration-200"
            >
              ← Back to all blogs
            </Link>
          </div>
        </article>

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-[300px] shrink-0 flex flex-col gap-6">

          {/* Tags */}
          {tags.length > 0 && (
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(19,47,70,0.07)] p-6">
              <h3 className="text-[15px] font-bold text-primary mb-4 pb-3 border-b border-primary/10">
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[12px] font-semibold text-gold bg-gold/10 border border-gold/20 px-3 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent posts */}
          {recentBlogs.length > 0 && (
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(19,47,70,0.07)] p-6">
              <h3 className="text-[15px] font-bold text-primary mb-4 pb-3 border-b border-primary/10">
                Recent Posts
              </h3>
              <div className="flex flex-col gap-4">
                {recentBlogs.map((b) => {
                  const bSlug = b.custom_url || makeSlug(b.blog_heading);
                  const bDate = b.date
                    ? new Date(b.date).toLocaleDateString("en-CA", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "";
                  return (
                    <Link
                      key={b._id}
                      href={`/blogs/${bSlug}`}
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
                        {bDate && (
                          <p className="text-[11px] text-primary/40 mt-1">{bDate}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Free Assessment CTA */}
          <div className="bg-primary rounded-2xl p-6 text-white text-center sticky top-6">
            <div className="text-[32px] mb-3">🇨🇦</div>
            <h3 className="text-[18px] font-bold mb-2">
              Start Your Process Today!
            </h3>
            <p className="text-white/70 text-[13px] mb-5">
              Book a free assessment with our immigration experts right now.
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
