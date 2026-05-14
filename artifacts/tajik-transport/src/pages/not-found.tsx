import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-white px-6">
      <div className="max-w-md text-center">
        <AlertCircle className="h-12 w-12 text-primary mx-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">{t("notFound.title")}</h1>
        <p className="text-white/60 font-light mb-8">{t("notFound.body")}</p>
        <Link
          href="/"
          className="inline-block border border-primary/60 text-primary hover:bg-primary hover:text-black transition-all px-8 py-3 text-xs tracking-[0.25em] uppercase font-semibold"
        >
          {t("notFound.back")}
        </Link>
      </div>
    </main>
  );
}
