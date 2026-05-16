import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListServices,
  getListServicesQueryKey,
  useCreateService,
  useUpdateService,
  useDeleteService,
  type Service,
  type ServiceInput,
} from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";
import { AdminLayout, ModalShell, ConfirmDialog } from "@/components/admin/AdminLayout";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { I18nField } from "@/components/admin/I18nField";
import { LocalizedField } from "@/components/admin/LocalizedField";
import type { LocalizedString } from "@workspace/api-client-react";

const EMPTY: ServiceInput = {
  slug: "",
  title: "",
  iconName: "",
  image: "",
  shortDescription: "",
  description: "",
  bullets: [],
  isVisaSupport: false,
  hidden: false,
  sortOrder: 0,
};

const inputCls =
  "w-full bg-black border border-white/10 px-4 py-2.5 text-white text-sm focus:border-primary focus:outline-none";
const labelCls = "block text-xs uppercase tracking-wider text-gray-400 mb-1.5";

function BulletsEditor({
  value,
  onChange,
}: {
  value: LocalizedString[];
  onChange: (v: LocalizedString[]) => void;
}) {
  const update = (i: number, v: string | Record<string, string>) =>
    onChange(value.map((x, idx) => (idx === i ? v : x)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const c = [...value];
    [c[i], c[j]] = [c[j], c[i]];
    onChange(c);
  };
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1">
            <LocalizedField
              compact
              value={item}
              onChange={(v) => update(i, v)}
              placeholder="e.g. Meet & greet at arrivals"
            />
          </div>
          <div className="flex flex-col gap-0.5 mt-1">
            <button
              type="button"
              onClick={() => move(i, -1)}
              className="p-1 text-gray-500 hover:text-white"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              className="p-1 text-gray-500 hover:text-white"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-2 text-red-500 hover:text-red-400 mt-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="px-3 py-1.5 border border-white/15 text-[10px] uppercase tracking-wider text-gray-300 hover:border-primary hover:text-primary"
      >
        + Add Bullet
      </button>
    </div>
  );
}

function ServiceForm({
  initial,
  pending,
  onSubmit,
  onCancel,
}: {
  initial: ServiceInput;
  pending: boolean;
  onSubmit: (data: ServiceInput) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<ServiceInput>(initial);

  useEffect(() => {
    setData(initial);
  }, [initial]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(data);
      }}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Slug *</label>
          <input
            required
            value={data.slug}
            onChange={(e) => setData({ ...data, slug: e.target.value })}
            className={inputCls}
            placeholder="airport-transfer"
          />
        </div>
        <div>
          <label className={labelCls}>Icon name</label>
          <input
            value={data.iconName ?? ""}
            onChange={(e) => setData({ ...data, iconName: e.target.value })}
            className={inputCls}
            placeholder="Plane"
          />
          <p className="text-[10px] text-gray-500 mt-1">Lucide icon name, e.g. Plane, Car, Briefcase</p>
        </div>
        <div>
          <label className={labelCls}>Title *</label>
          <input
            required
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className={inputCls}
            placeholder="Airport Transfers"
          />
          <I18nField
            value={data.titleI18n}
            onChange={(v) => setData({ ...data, titleI18n: v })}
            enPreview={data.title}
          />
        </div>
        <div>
          <label className={labelCls}>Sort order</label>
          <input
            type="number"
            value={data.sortOrder ?? 0}
            onChange={(e) =>
              setData({ ...data, sortOrder: parseInt(e.target.value, 10) || 0 })
            }
            className={inputCls}
          />
        </div>
        <div className="flex items-end gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
            <input
              type="checkbox"
              checked={data.hidden ?? false}
              onChange={(e) => setData({ ...data, hidden: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            Hidden
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
            <input
              type="checkbox"
              checked={data.isVisaSupport ?? false}
              onChange={(e) => setData({ ...data, isVisaSupport: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            Visa support
          </label>
        </div>
      </div>

      <div>
        <label className={labelCls}>Short description (card teaser)</label>
        <textarea
          value={data.shortDescription ?? ""}
          onChange={(e) => setData({ ...data, shortDescription: e.target.value })}
          rows={2}
          className={inputCls}
          placeholder="One-line summary shown on the services card."
        />
        <I18nField
          multiline
          rows={2}
          value={data.shortDescriptionI18n}
          onChange={(v) => setData({ ...data, shortDescriptionI18n: v })}
          enPreview={data.shortDescription ?? ""}
        />
      </div>

      <div>
        <label className={labelCls}>Full description</label>
        <textarea
          value={data.description ?? ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={4}
          className={inputCls}
        />
        <I18nField
          multiline
          rows={3}
          value={data.descriptionI18n}
          onChange={(v) => setData({ ...data, descriptionI18n: v })}
          enPreview={data.description ?? ""}
        />
      </div>

      <ImageUploadField
        label="Service image"
        value={data.image ?? ""}
        onChange={(v) => setData({ ...data, image: v })}
      />

      <div>
        <h3 className="font-serif text-base text-primary mb-3">Bullets / Features</h3>
        <BulletsEditor
          value={data.bullets ?? []}
          onChange={(v) => setData({ ...data, bullets: v })}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 border border-white/20 text-gray-300 hover:bg-white/5 text-xs uppercase tracking-wider"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2 bg-primary hover:bg-primary/90 text-black text-xs uppercase tracking-wider font-medium disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save Service"}
        </button>
      </div>
    </form>
  );
}

export function AdminServicesPage() {
  const queryClient = useQueryClient();
  const { data: services, isLoading } = useListServices();
  const createS = useCreateService();
  const updateS = useUpdateService();
  const deleteS = useDeleteService();

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [confirmDel, setConfirmDel] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });

  const handleCreate = (data: ServiceInput) => {
    setError(null);
    createS.mutate(
      { data },
      {
        onSuccess: () => {
          refresh();
          setAdding(false);
        },
        onError: (e) => setError((e as Error).message ?? "Failed to create"),
      },
    );
  };

  const handleUpdate = (data: ServiceInput) => {
    if (!editing) return;
    setError(null);
    updateS.mutate(
      { id: editing.id, data },
      {
        onSuccess: () => {
          refresh();
          setEditing(null);
        },
        onError: (e) => setError((e as Error).message ?? "Failed to update"),
      },
    );
  };

  const handleDelete = () => {
    if (!confirmDel) return;
    deleteS.mutate(
      { id: confirmDel.id },
      {
        onSuccess: () => {
          refresh();
          setConfirmDel(null);
        },
      },
    );
  };

  const initialForEdit: ServiceInput | null = editing
    ? {
        slug: editing.slug,
        title: editing.title,
        titleI18n: editing.titleI18n,
        iconName: editing.iconName,
        image: editing.image,
        shortDescription: editing.shortDescription,
        shortDescriptionI18n: editing.shortDescriptionI18n,
        description: editing.description,
        descriptionI18n: editing.descriptionI18n,
        bullets: editing.bullets ?? [],
        isVisaSupport: editing.isVisaSupport,
        hidden: editing.hidden,
        sortOrder: editing.sortOrder,
      }
    : null;

  return (
    <AdminLayout title="Services">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-white">Services</h1>
        <button
          onClick={() => {
            setError(null);
            setAdding(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-black text-xs uppercase tracking-wider font-medium"
        >
          <Plus className="w-4 h-4" />
          New Service
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-500/40 text-red-300 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : (
        <div className="space-y-2">
          {(services ?? []).map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-4 bg-[#0a0a0a] border border-white/10 px-5 py-4 hover:border-white/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white font-medium truncate">{s.title}</span>
                  {s.hidden && (
                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                      <EyeOff className="w-3 h-3" /> hidden
                    </span>
                  )}
                  {!s.hidden && (
                    <span className="flex items-center gap-1 text-[10px] text-green-500">
                      <Eye className="w-3 h-3" /> visible
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  /{s.slug} · sort {s.sortOrder}
                  {s.isVisaSupport ? " · visa-support" : ""}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setError(null);
                    setEditing(s);
                  }}
                  className="p-2 text-gray-400 hover:text-primary transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setConfirmDel(s)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {(services ?? []).length === 0 && (
            <p className="text-gray-500 text-sm py-6 text-center">
              No services yet. Click "New Service" to add one.
            </p>
          )}
        </div>
      )}

      <ModalShell
        open={adding}
        title="New Service"
        onClose={() => setAdding(false)}
      >
        <ServiceForm
          initial={EMPTY}
          pending={createS.isPending}
          onSubmit={handleCreate}
          onCancel={() => setAdding(false)}
        />
      </ModalShell>

      <ModalShell
        open={!!editing}
        title="Edit Service"
        onClose={() => setEditing(null)}
      >
        {initialForEdit && (
          <ServiceForm
            initial={initialForEdit}
            pending={updateS.isPending}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </ModalShell>

      <ConfirmDialog
        open={!!confirmDel}
        title="Delete Service"
        message={`Delete "${confirmDel?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onClose={() => setConfirmDel(null)}
      />
    </AdminLayout>
  );
}
