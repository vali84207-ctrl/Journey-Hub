import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetSiteSettings,
  useUpdateSiteSettings,
  getGetSiteSettingsQueryKey,
  type SiteSettings,
  type SiteSettingsInput,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { I18nField } from "@/components/admin/I18nField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { LangMap } from "@/lib/locale";

const inputCls =
  "w-full bg-black border border-white/10 px-4 py-2.5 text-white text-sm focus:border-primary focus:outline-none";
const labelCls = "block text-xs uppercase tracking-wider text-gray-400 mb-1.5";

const EMPTY: SiteSettingsInput = {
  heroEyebrow: "",
  heroTitleLine1: "",
  heroTitleLine2: "",
  heroSubtitle: "",
  heroBackgroundImage: "",
  contactPhone: "",
  contactWhatsapp: "",
  contactTelegram: "",
  contactEmail: "",
  contactAddress: "",
  contactMapsUrl: "",
  footerTagline: "",
};

function fromApi(s: SiteSettings): SiteSettingsInput {
  return {
    heroEyebrow: s.heroEyebrow,
    heroEyebrowI18n: s.heroEyebrowI18n,
    heroTitleLine1: s.heroTitleLine1,
    heroTitleLine1I18n: s.heroTitleLine1I18n,
    heroTitleLine2: s.heroTitleLine2,
    heroTitleLine2I18n: s.heroTitleLine2I18n,
    heroSubtitle: s.heroSubtitle,
    heroSubtitleI18n: s.heroSubtitleI18n,
    heroBackgroundImage: s.heroBackgroundImage,
    contactPhone: s.contactPhone,
    contactWhatsapp: s.contactWhatsapp,
    contactTelegram: s.contactTelegram,
    contactEmail: s.contactEmail,
    contactAddress: s.contactAddress,
    contactAddressI18n: s.contactAddressI18n,
    contactMapsUrl: s.contactMapsUrl,
    footerTagline: s.footerTagline,
    footerTaglineI18n: s.footerTaglineI18n,
  };
}

export function AdminSiteSettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetSiteSettings();
  const update = useUpdateSiteSettings();
  const [form, setForm] = useState<SiteSettingsInput>(EMPTY);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) setForm(fromApi(data));
  }, [data]);

  const set = <K extends keyof SiteSettingsInput>(k: K, v: SiteSettingsInput[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const setI18n = (key: keyof SiteSettingsInput, v: LangMap) => {
    setForm((prev) => ({ ...prev, [key]: v }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    update.mutate(
      { data: form },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() });
          setSavedAt(new Date().toLocaleTimeString());
        },
        onError: (e) => setError((e as Error).message ?? "Failed to save"),
      },
    );
  };

  if (isLoading) {
    return (
      <AdminLayout title="Site Settings">
        <div className="text-gray-500">Loading…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Site Settings">
      <form onSubmit={onSubmit} className="space-y-8 max-w-4xl">
        <section className="space-y-4">
          <h2 className="font-serif text-lg text-primary">Homepage Hero</h2>
          <div>
            <label className={labelCls}>Eyebrow tagline (above title)</label>
            <input
              value={form.heroEyebrow ?? ""}
              onChange={(e) => set("heroEyebrow", e.target.value)}
              className={inputCls}
            />
            <I18nField
              value={form.heroEyebrowI18n}
              onChange={(v) => setI18n("heroEyebrowI18n", v)}
              enPreview={form.heroEyebrow}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title line 1</label>
              <input
                value={form.heroTitleLine1 ?? ""}
                onChange={(e) => set("heroTitleLine1", e.target.value)}
                className={inputCls}
              />
              <I18nField
                value={form.heroTitleLine1I18n}
                onChange={(v) => setI18n("heroTitleLine1I18n", v)}
                enPreview={form.heroTitleLine1}
              />
            </div>
            <div>
              <label className={labelCls}>Title line 2 (gold)</label>
              <input
                value={form.heroTitleLine2 ?? ""}
                onChange={(e) => set("heroTitleLine2", e.target.value)}
                className={inputCls}
              />
              <I18nField
                value={form.heroTitleLine2I18n}
                onChange={(v) => setI18n("heroTitleLine2I18n", v)}
                enPreview={form.heroTitleLine2}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Hero subtitle</label>
            <textarea
              value={form.heroSubtitle ?? ""}
              onChange={(e) => set("heroSubtitle", e.target.value)}
              rows={2}
              className={inputCls}
            />
            <I18nField
              multiline
              rows={2}
              value={form.heroSubtitleI18n}
              onChange={(v) => setI18n("heroSubtitleI18n", v)}
              enPreview={form.heroSubtitle}
            />
          </div>
          <ImageUploadField
            label="Hero background image"
            value={form.heroBackgroundImage ?? ""}
            onChange={(v) => set("heroBackgroundImage", v)}
          />
        </section>

        <section className="space-y-4 pt-6 border-t border-white/10">
          <h2 className="font-serif text-lg text-primary">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Phone</label>
              <input
                value={form.contactPhone ?? ""}
                onChange={(e) => set("contactPhone", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>WhatsApp number</label>
              <input
                value={form.contactWhatsapp ?? ""}
                onChange={(e) => set("contactWhatsapp", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Telegram handle</label>
              <input
                value={form.contactTelegram ?? ""}
                onChange={(e) => set("contactTelegram", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                value={form.contactEmail ?? ""}
                onChange={(e) => set("contactEmail", e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Google Maps URL</label>
              <input
                value={form.contactMapsUrl ?? ""}
                onChange={(e) => set("contactMapsUrl", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Address (multi-line)</label>
            <textarea
              value={form.contactAddress ?? ""}
              onChange={(e) => set("contactAddress", e.target.value)}
              rows={2}
              className={inputCls}
            />
            <I18nField
              multiline
              rows={2}
              value={form.contactAddressI18n}
              onChange={(v) => setI18n("contactAddressI18n", v)}
              enPreview={form.contactAddress}
            />
          </div>
        </section>

        <section className="space-y-4 pt-6 border-t border-white/10">
          <h2 className="font-serif text-lg text-primary">Footer</h2>
          <div>
            <label className={labelCls}>Footer tagline</label>
            <textarea
              value={form.footerTagline ?? ""}
              onChange={(e) => set("footerTagline", e.target.value)}
              rows={2}
              className={inputCls}
            />
            <I18nField
              multiline
              rows={2}
              value={form.footerTaglineI18n}
              onChange={(v) => setI18n("footerTaglineI18n", v)}
              enPreview={form.footerTagline}
            />
          </div>
        </section>

        {error && (
          <div className="px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}
        <div className="flex items-center gap-4 pt-4 border-t border-white/10 sticky bottom-0 bg-[#050505] py-4">
          <button
            type="submit"
            disabled={update.isPending}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-black text-xs uppercase tracking-wider font-medium disabled:opacity-50"
          >
            {update.isPending ? "Saving…" : "Save Site Settings"}
          </button>
          {savedAt && <span className="text-xs text-green-400">Saved at {savedAt}</span>}
        </div>
      </form>
    </AdminLayout>
  );
}
