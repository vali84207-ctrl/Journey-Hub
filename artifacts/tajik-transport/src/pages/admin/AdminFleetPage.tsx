import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListVehicles,
  getListVehiclesQueryKey,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  type Vehicle,
  type VehicleInput,
} from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, EyeOff, Eye } from "lucide-react";
import { AdminLayout, ModalShell, ConfirmDialog } from "@/components/admin/AdminLayout";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { GalleryUploadField } from "@/components/admin/GalleryUploadField";
import { I18nField } from "@/components/admin/I18nField";
import { pickLocaleArray } from "@/lib/locale";

const STATUS_STYLES: Record<string, string> = {
  available: "bg-green-500/15 border-green-500/40 text-green-400",
  reserved: "bg-amber-500/15 border-amber-500/40 text-amber-400",
  busy: "bg-red-500/15 border-red-500/40 text-red-400",
  hidden: "bg-gray-500/20 border-gray-500/40 text-gray-300",
};

const EMPTY: VehicleInput = {
  code: "",
  name: "",
  model: "",
  year: 2024,
  type: "",
  pax: 7,
  pricePerDay: 100,
  description: "",
  features: [],
  mainImage: "",
  gallery: [],
  bookingVisible: true,
  sortOrder: 0,
  status: "available",
  nameI18n: {},
  modelI18n: {},
  typeI18n: {},
  descriptionI18n: {},
};

function toLines(arr?: string[] | null) {
  return (arr ?? []).join("\n");
}
function fromLines(text: string): string[] {
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
}

function VehicleForm({
  initial,
  pending,
  onSubmit,
  onCancel,
}: {
  initial: VehicleInput;
  pending: boolean;
  onSubmit: (data: VehicleInput) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<VehicleInput>(initial);
  const [featuresText, setFeaturesText] = useState(
    toLines(pickLocaleArray(initial.features, "en")),
  );
  const [galleryText, setGalleryText] = useState(toLines(initial.gallery));

  useEffect(() => {
    setData(initial);
    setFeaturesText(toLines(pickLocaleArray(initial.features, "en")));
    setGalleryText(toLines(initial.gallery));
  }, [initial]);

  const inputCls =
    "w-full bg-black border border-white/10 px-4 py-2.5 text-white text-sm focus:border-primary focus:outline-none";
  const labelCls = "block text-xs uppercase tracking-wider text-gray-400 mb-1.5";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...data,
          features: fromLines(featuresText),
          gallery: fromLines(galleryText),
        });
      }}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Code *</label>
          <input
            required
            value={data.code}
            onChange={(e) => setData({ ...data, code: e.target.value })}
            className={inputCls}
            placeholder="LC300-04"
          />
        </div>
        <div>
          <label className={labelCls}>Display Name</label>
          <input
            value={data.name ?? ""}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className={inputCls}
            placeholder="Land Cruiser 300"
          />
          <I18nField
            value={data.nameI18n}
            onChange={(v) => setData({ ...data, nameI18n: v })}
            enPreview={data.name ?? ""}
          />
        </div>
        <div>
          <label className={labelCls}>Model *</label>
          <input
            required
            value={data.model}
            onChange={(e) => setData({ ...data, model: e.target.value })}
            className={inputCls}
            placeholder="Toyota Land Cruiser 300"
          />
          <I18nField
            value={data.modelI18n}
            onChange={(v) => setData({ ...data, modelI18n: v })}
            enPreview={data.model}
          />
        </div>
        <div>
          <label className={labelCls}>Type *</label>
          <input
            required
            value={data.type}
            onChange={(e) => setData({ ...data, type: e.target.value })}
            className={inputCls}
            placeholder="LC300"
          />
          <I18nField
            value={data.typeI18n}
            onChange={(v) => setData({ ...data, typeI18n: v })}
            enPreview={data.type}
          />
        </div>
        <div>
          <label className={labelCls}>Year</label>
          <input
            type="number"
            value={data.year ?? 2024}
            onChange={(e) => setData({ ...data, year: parseInt(e.target.value, 10) || 2024 })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Passengers</label>
          <input
            type="number"
            value={data.pax ?? 7}
            onChange={(e) => setData({ ...data, pax: parseInt(e.target.value, 10) || 1 })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Price per day (USD)</label>
          <input
            type="number"
            value={data.pricePerDay ?? 100}
            onChange={(e) =>
              setData({ ...data, pricePerDay: parseInt(e.target.value, 10) || 0 })
            }
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Sort order</label>
          <input
            type="number"
            value={data.sortOrder ?? 0}
            onChange={(e) => setData({ ...data, sortOrder: parseInt(e.target.value, 10) || 0 })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select
            value={data.status ?? "available"}
            onChange={(e) =>
              setData({ ...data, status: e.target.value as VehicleInput["status"] })
            }
            className={inputCls}
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="busy">Busy</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.bookingVisible ?? true}
              onChange={(e) => setData({ ...data, bookingVisible: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-gray-300">Show booking / WhatsApp buttons</span>
          </label>
        </div>
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea
          value={data.description ?? ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={3}
          className={inputCls}
          placeholder="Short description shown on fleet pages…"
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
        label="Main image"
        value={data.mainImage ?? ""}
        onChange={(v) => setData({ ...data, mainImage: v })}
      />

      <GalleryUploadField
        label="Gallery images"
        value={fromLines(galleryText)}
        onChange={(arr) => setGalleryText(toLines(arr))}
        coverValue={data.mainImage ?? ""}
        onSetCover={(url) => setData({ ...data, mainImage: url })}
        helperText="Click the ★ on any gallery image to use it as the cover."
      />

      <div>
        <label className={labelCls}>Features (one per line — EN; not yet translated)</label>
        <textarea
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          rows={4}
          className={inputCls}
          placeholder={"AC\nWiFi\nProfessional Driver"}
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
          {pending ? "Saving…" : "Save Vehicle"}
        </button>
      </div>
    </form>
  );
}

export function AdminFleetPage() {
  const queryClient = useQueryClient();
  const { data: vehicles, isLoading } = useListVehicles();
  const createV = useCreateVehicle();
  const updateV = useUpdateVehicle();
  const deleteV = useDeleteVehicle();

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [confirmDel, setConfirmDel] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });

  const handleCreate = (data: VehicleInput) => {
    setError(null);
    createV.mutate(
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

  const handleUpdate = (data: VehicleInput) => {
    if (!editing) return;
    setError(null);
    updateV.mutate(
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
    deleteV.mutate(
      { id: confirmDel.id },
      {
        onSuccess: () => {
          refresh();
          setConfirmDel(null);
        },
      },
    );
  };

  const initialForEdit: VehicleInput | null = editing
    ? {
        code: editing.code,
        name: editing.name,
        model: editing.model,
        year: editing.year,
        type: editing.type,
        pax: editing.pax,
        pricePerDay: editing.pricePerDay,
        description: editing.description,
        features: editing.features,
        mainImage: editing.mainImage,
        gallery: editing.gallery,
        bookingVisible: editing.bookingVisible,
        sortOrder: editing.sortOrder,
        status: editing.status,
        nameI18n: editing.nameI18n,
        modelI18n: editing.modelI18n,
        typeI18n: editing.typeI18n,
        descriptionI18n: editing.descriptionI18n,
      }
    : null;

  return (
    <AdminLayout title="Fleet Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-gray-400 font-light">
            {vehicles?.length ?? 0} vehicles · changes appear instantly on the public site.
          </p>
          <button
            onClick={() => {
              setError(null);
              setAdding(true);
            }}
            className="bg-primary hover:bg-primary/90 text-black px-5 py-2.5 text-xs uppercase tracking-wider font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>

        {isLoading ? (
          <div className="h-32 flex items-center justify-center border border-white/5 bg-white/5">
            <span className="text-gray-500">Loading vehicles…</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {vehicles?.map((v) => (
              <div key={v.id} className="bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col">
                <div className="relative h-40 bg-black">
                  {v.mainImage ? (
                    <img src={v.mainImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs uppercase">
                      No image
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/80 border border-white/20 px-2 py-1 text-[10px] font-mono">
                    {v.code}
                  </div>
                  <div
                    className={`absolute top-3 right-3 px-2 py-1 text-[10px] uppercase tracking-wider border ${
                      STATUS_STYLES[v.status] ?? STATUS_STYLES.busy
                    }`}
                  >
                    {v.status}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-serif text-white">{v.name || v.model}</h3>
                    <span className="text-primary text-sm">${v.pricePerDay}/d</span>
                  </div>
                  <div className="text-gray-500 text-xs mb-3">
                    {v.year} · {v.pax} pax · {v.type}
                  </div>
                  <p className="text-gray-400 text-xs font-light line-clamp-2 mb-4 flex-1">
                    {v.description || "No description."}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500 mb-3">
                    {v.bookingVisible ? (
                      <span className="flex items-center gap-1 text-green-400/80">
                        <Eye className="w-3 h-3" /> Bookable
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-500">
                        <EyeOff className="w-3 h-3" /> Hidden booking
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setError(null);
                        setEditing(v);
                      }}
                      className="flex-1 border border-white/20 hover:bg-white/5 text-xs uppercase tracking-wider py-2 flex items-center justify-center gap-2"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setConfirmDel(v)}
                      className="border border-red-500/30 hover:bg-red-500/10 text-red-400 text-xs uppercase tracking-wider py-2 px-3 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ModalShell open={adding} title="Add New Vehicle" onClose={() => setAdding(false)} wide>
        {error && (
          <div className="mb-4 px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}
        <VehicleForm
          initial={EMPTY}
          pending={createV.isPending}
          onSubmit={handleCreate}
          onCancel={() => setAdding(false)}
        />
      </ModalShell>

      <ModalShell
        open={!!editing}
        title={`Edit ${editing?.code ?? ""}`}
        onClose={() => setEditing(null)}
        wide
      >
        {error && (
          <div className="mb-4 px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}
        {initialForEdit && (
          <VehicleForm
            initial={initialForEdit}
            pending={updateV.isPending}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </ModalShell>

      <ConfirmDialog
        open={!!confirmDel}
        title="Delete vehicle?"
        message={`This will permanently remove ${confirmDel?.code ?? ""} from the fleet. This action cannot be undone.`}
        onClose={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        pending={deleteV.isPending}
      />
    </AdminLayout>
  );
}
