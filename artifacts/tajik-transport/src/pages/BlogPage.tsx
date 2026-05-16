import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, MapPin, Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navbar } from "../components/home/Navbar";
import { Footer } from "../components/footer";
import { useListBlogPosts } from "@workspace/api-client-react";
import { pickI18n, useActiveLang } from "@/lib/locale";

export function BlogPage() {
  const { t, i18n } = useTranslation();
  const lang = useActiveLang(i18n.language);
  const { data, isLoading } = useListBlogPosts();
  const all = (data ?? []).filter((p) => p.published);
  const featured = all[0];
  const rest = all.slice(1);

  return (
    <main className="min-h-screen bg-background text-white selection:bg-primary selection:text-black">
      <Navbar />

      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: "linear-gradient(180deg, #050505 0%, #0a0a0a 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(221,184,95,0.10) 0%, transparent 60%)" }} />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-primary/80" />
              <span className="text-primary text-[10px] tracking-[0.35em] uppercase font-medium">{t("blog.eyebrow")}</span>
            </div>
            <h1 className="font-sans font-black text-white uppercase leading-[0.95] mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.01em" }}>
              {t("blog.heroLine1")}<br />
              <span style={{
                background: "linear-gradient(180deg, #F0D079 0%, #DDB85F 50%, #B8923D 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 32px rgba(221,184,95,0.25))",
              }}>
                {t("blog.heroLine2")}
              </span>
            </h1>
            <p className="text-white/65 text-base lg:text-lg font-light leading-relaxed max-w-2xl">
              {t("blog.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {isLoading ? (
        <section className="py-24 flex justify-center" style={{ background: "#0a0a0a" }}>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </section>
      ) : all.length === 0 ? (
        <section className="py-24 text-center" style={{ background: "#0a0a0a" }}>
          <p className="text-white/50 font-light">{t("blog.empty")}</p>
        </section>
      ) : (
        <>
          {featured && (() => {
            const fTitle = pickI18n(featured.title, featured.titleI18n, lang);
            const fExcerpt = pickI18n(featured.excerpt, featured.excerptI18n, lang);
            const fCategory = pickI18n(featured.category, featured.categoryI18n, lang);
            const fLocation = pickI18n(featured.location, featured.locationI18n, lang);
            const fReadTime = pickI18n(featured.readTime, featured.readTimeI18n, lang);
            return (
            <section className="py-12" style={{ background: "#0a0a0a" }}>
              <div className="container mx-auto px-6 max-w-7xl">
                <Link href={`/blog/${featured.slug}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="group grid grid-cols-1 lg:grid-cols-2 gap-10 cursor-pointer"
                  >
                    <div className="relative overflow-hidden h-72 lg:h-[480px]">
                      <img src={featured.cover} alt={fTitle} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-5 left-5 bg-primary text-black text-[10px] tracking-[0.25em] uppercase font-bold px-3 py-1.5">{t("blog.featured")}</div>
                      <div className="absolute bottom-5 left-5 text-[10px] uppercase tracking-widest text-white/85 bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/10">{fCategory}</div>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-5 text-white/45 text-[11px] tracking-widest uppercase mb-5">
                        <span className="flex items-center gap-1.5"><MapPin size={11} className="text-primary/70" />{fLocation}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={11} className="text-primary/70" />{featured.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={11} className="text-primary/70" />{fReadTime}</span>
                      </div>
                      <h2 className="font-sans font-bold text-white text-3xl lg:text-4xl xl:text-5xl leading-[1.05] mb-5 group-hover:text-primary transition-colors duration-400">
                        {fTitle}
                      </h2>
                      <p className="text-white/65 text-base font-light leading-relaxed mb-8 max-w-xl">{fExcerpt}</p>
                      <div className="flex items-center gap-3 text-primary text-xs tracking-[0.25em] uppercase font-semibold">
                        {t("blog.readStory")} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-400" />
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </div>
            </section>
            );
          })()}

          <div className="container mx-auto px-6 max-w-7xl"><div className="gold-divider opacity-60" /></div>

          {rest.length > 0 && (
            <section className="py-20" style={{ background: "#0a0a0a" }}>
              <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px w-8 bg-primary/70" />
                      <span className="text-primary text-[10px] tracking-[0.3em] uppercase font-medium">{t("blog.allStoriesEyebrow")}</span>
                    </div>
                    <h3 className="font-sans font-black text-white uppercase text-3xl lg:text-4xl">{t("blog.allStoriesTitle")}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
                  {rest.map((post, i) => {
                    const pTitle = pickI18n(post.title, post.titleI18n, lang);
                    const pExcerpt = pickI18n(post.excerpt, post.excerptI18n, lang);
                    const pCategory = pickI18n(post.category, post.categoryI18n, lang);
                    const pLocation = pickI18n(post.location, post.locationI18n, lang);
                    const pReadTime = pickI18n(post.readTime, post.readTimeI18n, lang);
                    return (
                    <motion.article
                      key={post.slug}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.55, delay: i * 0.07 }}
                      style={{ background: "#0a0a0a" }}
                    >
                      <Link href={`/blog/${post.slug}`} className="group block h-full">
                        <div className="relative overflow-hidden h-64">
                          <img src={post.cover} alt={pTitle} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-500" />
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                          <div className="absolute top-4 left-4 text-[9px] uppercase tracking-widest text-primary/90 bg-black/70 backdrop-blur-sm px-2.5 py-1 border border-primary/20">{pCategory}</div>
                        </div>

                        <div className="p-7 border-t border-white/5 group-hover:border-primary/25 transition-colors duration-400">
                          <div className="flex items-center gap-4 text-white/40 text-[10px] tracking-widest uppercase mb-3">
                            <span className="flex items-center gap-1.5"><MapPin size={10} className="text-primary/60" />{pLocation}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={10} className="text-primary/60" />{post.date}</span>
                          </div>
                          <h4 className="font-sans font-bold text-white text-lg leading-tight mb-3 group-hover:text-primary transition-colors duration-400 min-h-[3.5rem]">
                            {pTitle}
                          </h4>
                          <p className="text-white/55 text-sm font-light leading-relaxed mb-5 line-clamp-3">{pExcerpt}</p>
                          <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            <span className="text-white/35 text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                              <Clock size={10} className="text-primary/50" />{pReadTime}
                            </span>
                            <div className="flex items-center gap-2 text-primary text-[10px] tracking-widest uppercase font-semibold">
                              {t("blog.readMore")} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </main>
  );
}
