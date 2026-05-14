import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, MapPin, Calendar, Clock, User } from "lucide-react";
import { Navbar } from "../components/home/Navbar";
import { Footer } from "../components/footer";
import { useGetBlogPostBySlug, useListBlogPosts } from "@workspace/api-client-react";

export function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading } = useGetBlogPostBySlug(params.slug);
  const { data: allPosts } = useListBlogPosts();

  useEffect(() => { window.scrollTo(0, 0); }, [params.slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-white">
        <Navbar />
        <div className="pt-40 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background text-white">
        <Navbar />
        <div className="container mx-auto px-6 max-w-2xl pt-40 pb-20 text-center">
          <p className="text-primary text-[10px] tracking-[0.35em] uppercase mb-4">404 — Not Found</p>
          <h1 className="font-sans font-black text-3xl uppercase mb-6">This story doesn't exist</h1>
          <p className="text-white/60 mb-8">The journal entry you're looking for has either moved or hasn't been published yet.</p>
          <Link href="/blog" className="inline-block border border-primary/60 text-primary hover:bg-primary hover:text-black transition-all px-8 py-3 text-xs tracking-[0.25em] uppercase font-semibold">
            ← Back to Journal
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const published = (allPosts ?? []).filter((p) => p.published);
  const idx = published.findIndex((p) => p.slug === post.slug);
  const next = published.length > 0 ? published[(idx + 1) % published.length] : null;

  return (
    <main className="min-h-screen bg-background text-white selection:bg-primary selection:text-black">
      <Navbar />

      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={post.cover} alt={post.title} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.85) saturate(1.05)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.20) 35%, rgba(0,0,0,0.85) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 60% 30%, rgba(221,184,95,0.10) 0%, transparent 55%)" }} />

        <div className="relative z-10 h-full flex items-end pb-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <Link href="/blog" className="inline-flex items-center gap-2 text-white/70 hover:text-primary text-[10px] tracking-[0.3em] uppercase mb-8 transition-colors">
                <ArrowLeft size={12} /> Back to Journal
              </Link>
              <div className="inline-block bg-primary text-black text-[10px] tracking-[0.25em] uppercase font-bold px-3 py-1.5 mb-5">{post.category}</div>
              <h1 className="font-sans font-black text-white uppercase leading-[1] mb-6" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "-0.01em", textShadow: "0 4px 30px rgba(0,0,0,0.7)" }}>
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/75 text-[11px] tracking-widest uppercase">
                <span className="flex items-center gap-1.5"><User size={11} className="text-primary" />{post.author}</span>
                {post.location && <span className="flex items-center gap-1.5"><MapPin size={11} className="text-primary" />{post.location}</span>}
                <span className="flex items-center gap-1.5"><Calendar size={11} className="text-primary" />{post.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={11} className="text-primary" />{post.readTime}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <article className="py-20" style={{ background: "#0a0a0a" }}>
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-white/85 text-xl lg:text-2xl font-light leading-relaxed mb-12 pb-8" style={{ borderBottom: "1px solid rgba(221,184,95,0.2)" }}>
            {post.excerpt}
          </motion.p>

          <div className="space-y-8">
            {post.content.map((block, i) => {
              if (block.type === "heading") {
                return (
                  <motion.h2 key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="font-sans font-bold text-white text-2xl lg:text-3xl uppercase tracking-tight pt-6">
                    <span className="text-primary mr-3">—</span>{block.text}
                  </motion.h2>
                );
              }
              if (block.type === "paragraph") {
                return (
                  <motion.p key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="text-white/75 text-base lg:text-[17px] font-light leading-[1.85]">
                    {block.text}
                  </motion.p>
                );
              }
              if (block.type === "quote") {
                return (
                  <motion.blockquote key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="my-10 pl-6 py-4 border-l-2 border-primary">
                    <p className="font-serif italic text-white/85 text-xl lg:text-2xl leading-snug">"{block.text}"</p>
                  </motion.blockquote>
                );
              }
              if (block.type === "image") {
                return (
                  <motion.figure key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="my-10">
                    <div className="overflow-hidden">
                      <img src={block.src} alt={block.caption ?? ""} className="w-full h-auto" />
                    </div>
                    {block.caption && (
                      <figcaption className="text-white/45 text-xs uppercase tracking-widest mt-4 text-center font-light">{block.caption}</figcaption>
                    )}
                  </motion.figure>
                );
              }
              return null;
            })}
          </div>
        </div>

        {post.gallery.length > 0 && (
          <div className="container mx-auto px-6 max-w-6xl mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-primary/70" />
              <span className="text-primary text-[10px] tracking-[0.3em] uppercase font-medium">Gallery</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {post.gallery.map((src, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.08 }} className="overflow-hidden h-72 group cursor-pointer">
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </article>

      {next && next.slug !== post.slug && (
        <section className="py-16" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #060606 100%)", borderTop: "1px solid rgba(221,184,95,0.18)" }}>
          <div className="container mx-auto px-6 max-w-7xl">
            <Link href={`/blog/${next.slug}`}>
              <div className="group grid grid-cols-1 md:grid-cols-2 gap-8 cursor-pointer">
                <div className="flex flex-col justify-center">
                  <span className="text-primary text-[10px] tracking-[0.35em] uppercase font-medium mb-3">Next Story</span>
                  <h3 className="font-sans font-bold text-white text-2xl lg:text-3xl uppercase leading-tight mb-5 group-hover:text-primary transition-colors duration-400">{next.title}</h3>
                  <p className="text-white/55 text-sm font-light max-w-md mb-6">{next.excerpt}</p>
                  <div className="flex items-center gap-3 text-primary text-xs tracking-[0.25em] uppercase font-semibold">
                    Continue Reading <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
                <div className="relative overflow-hidden h-56 md:h-72">
                  <img src={next.cover} alt={next.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
