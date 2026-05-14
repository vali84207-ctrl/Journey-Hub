import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="cursor-pointer flex flex-col items-center md:items-start gap-3" onClick={scrollToTop}>
            <img src="/pamir-luxe-logo.png" alt="Pamir Luxe Drive" className="h-20 w-auto" />
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-primary text-sm uppercase tracking-wider transition-colors">{t("footer.privacy")}</a>
              <a href="#" className="text-gray-400 hover:text-primary text-sm uppercase tracking-wider transition-colors">{t("footer.terms")}</a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/992004044035"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-wider"
              >
                WhatsApp
              </a>
              <span className="text-white/10">|</span>
              <a
                href="https://t.me/PamirLuxeDrive"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-wider"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm font-light">
            &copy; {new Date().getFullYear()} Pamir Luxe Drive — VIP Transportation. {t("footer.rights")}
          </p>
          <p className="text-gray-600 text-sm font-light">
            {t("footer.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}
