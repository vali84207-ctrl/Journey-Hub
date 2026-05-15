import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListTours,
  getListToursQueryKey,
  useCreateTour,
  useUpdateTour,
  useDeleteTour,
  type Tour,
  type TourInput,
} from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { AdminLayout, ModalShell, ConfirmDialog } from "@/components/admin/AdminLayout";

const EMPTY: TourInput = {
  slug: "",
  title: "",
  shortDescription: "",
  description: "",
  duration: "",
  startingPrice: 0,
  route: "",
  mainImage: "",
  gallery: [],
  highlights: [],
  itinerary: [],
  included: [],
  featured: true,
  hidden: false,
  sortOrder: 0,
};

const inputCls =
  "w-full bg-black border border-white/10 px-4 py-2.5 text-white text-sm focus:border-primary focus:outline-none";
const labelCls = "block text-xs uppercase tracking-wider text-gray-400 mb-1.5";

function toLines(arr?: string[] | null) {
  return (arr ?? []).join("\n");
}
function fromLines(text: string): string[] {
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
}
type Highlight = { title: string; body: string };
type ItineraryDay = { day: number; title: string; body: string };

function highlightsToText(arr?: Highlight[] | null): string {
  return (arr ?? []).map((h) => `${h.title} | ${h.body}`).join("\n");
}
function highlightsFromText(t: string): Highlight[] {
  return t
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      return { title: (title ?? "").trim(), body: rest.join("|").trim() };
    })
    .filter((h) => h.title);
}
function itineraryToText(arr?: ItineraryDay[] | null): string {
  return (arr ?? []).map((d) => `${d.day} | ${d.title} | ${d.body}`).join("\n");
}
function itineraryFromText(t: string): ItineraryDay[] {
  return t
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((s) => s.trim());
      const day = parseInt(parts[0] ?? "0", 10) || 0;
      const title = parts[1] ?? "";
      const body = parts.slice(2).join("|").trim();
      return { day, title, body };
    })
    .filter((d) => d.title);
}

function TourForm({
  initial,
  pending,
  onSubmit,
  onCancel,
}: {
  initial: TourInput;
  pending: boolean;
  onSubmit: (data: TourInput) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<TourInput>(initial);
  const [galleryText, setGalleryText] = useState(toLines(initial.gallery));
  const [includedText, setIncludedText] = useState(toLines(initial.included));
  const [highlightsText, setHighlightsText] = useState(highlightsToText(initial.highlights));
  const [itineraryText, setItineraryText] = useState(itineraryToText(initial.itinerary));

  useEffect(() => {
    setData(initial);
    setGalleryText(toLines(initial.gallery));
    setIncludedText(toLines(initial.included));
    setHighlightsText(highlightsToText(initial.highlights));
    setItineraryText(itineraryToText(initial.itinerary));
  }, [initial]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...data,
          gallery: fromLines(galleryText),
          included: fromLines(includedText),
          highlights: highlightsFromText(highlightsText),
          itinerary: itineraryFromText(itineraryText),
        });
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
            placeholder="dushanbe-pamir-tour"
          />
        </div>
        <div>
          <label className={labelCls}>Title *</label>
          <input
            required
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className={inputCls}
            placeholder="Dushanbe → Pamir Tour"
          />
        </div>
        <div>
          <label className={labelCls}>Duration</label>
          <input
            value={data.duration ?? ""}
            onChange={(e) => setData({ ...data, duration: e.target.value })}
            className={inputCls}
            placeholder="7 Days · 6 Nights"
          />
        </div>
        <div>
          <label className={labelCls}>Starting price (USD)</label>
          <input
            type="number"
            value={data.startingPrice ?? 0}
            onChange={(e) =>
              setData({ ...data, startingPrice: parseInt(e.target.value, 10) || 0 })
            }
            className={inputCls}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Route summary</label>
          <input
            value={data.route ?? ""}
            onChange={(e) => setData({ ...data, route: e.target.value })}
            className={inputCls}
            placeholder="Dushanbe → Khorog → Murghab"
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
              checked={data.featured ?? true}
              onChange={(e) => setData({ ...data, featured: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
            <input
              type="checkbox"
              checked={data.hidden ?? false}
              onChange={(e) => setData({ ...data, hidden: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            Hidden
          </label>
        </div>
      </div>

      <div>
        <label className={labelCls}>Short description (homepage card)</label>
        <textarea
          value={data.shortDescription ?? ""}
          onChange={(e) => setData({ ...data, shortDescription: e.target.value })}
          rows={2}
          className={inputCls}
          placeholder="One-sentence teaser shown on the homepage card."
        />
      </div>

      <div>
        <label className={labelCls}>Full description (detail page)</label>
        <textarea
          value={data.description ?? ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={4}
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Main image URL</label>
        <input
          value={data.mainImage ?? ""}
          onChange={(e) => setData({ ...data, mainImage: e.target.value })}
          className={inputCls}
          placeholder="https://images.unsplash.com/…"
        />
        {data.mainImage && (
          <div className="mt-2 w-32 h-20 bg-black border border-white/10 overflow-hidden">
            <img src={data.mainImage} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div>
        <label className={labelCls}>Gallery image URLs (one per line)</label>
        <textarea
          value={galleryText}
          onChange={(e) => setGalleryText(e.target.value)}
          rows={3}
          className={`${inputCls} font-mono text-xs`}
          placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
        />
      </div>

      <div>
        <label className={labelCls}>
          Highlights (one per line, format: <code>Title | Body</code>)
        </label>
        <textarea
          value={highlightsText}
          onChange={(e) => setHighlightsText(e.target.value)}
          rows={3}
          className={inputCls}
          placeholder={"Wakhan Corridor | Two unhurried days through the Wakhan."}
        />
      </div>

      <div>
        <label className={labelCls}>
          Itinerary (one day per line, format: <code>day | Title | Body</code>)
        </label>
        <textarea
          value={itineraryText}
          onChange={(e) => setItineraryText(e.target.value)}
          rows={5}
          className={inputCls}
          placeholder={"1 | Dushanbe → Kalaikhum | Airport pickup, scenic drive east."}
        />
      </div>

      <div>
        <label className={labelCls}>What's included (one per line)</label>
        <textarea
          value={includedText}
          onChange={(e) => setIncludedText(e.target.value)}
          rows={4}
          className={inputCls}
          placeholder={"Private Land Cruiser 300 + VIP chauffeur\nAll fuel and road permits"}
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
          {pending ? "Saving…" : "Save Tour"}
        </button>
      </div>
    </form>
  );
}

export function AdminToursPage() {
  const queryClient = useQueryClient();
  const { data: tours, isLoading } = useListTours();
  const createT = useCreateTour();
  const updateT = useUpdateTour();
  const deleteT = useDeleteTour();

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [confirmDel, setConfirmDel] = useState<Tour | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: getListToursQueryKey() });

  const handleCreate = (data: TourInput) => {
    setError(null);
    createT.mutate(
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

  const handleUpdate = (data: TourInput) => {
    if (!editing) return;
    setError(null);
    updateT.mutate(
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
    deleteT.mutate(
      { id: confirmDel.id },
      {
        onSuccess: () => {
          refresh();
          setConfirmDel(null);
        },
      },
    );
  };

  const initialForEdit: TourInput | null = editing
    ? {
        slug: editing.slug,
        title: editing.title,
        shortDescription: editing.shortDescription,
        description: editing.description,
        duration: editing.duration,
        startingPrice: editing.startingPrice,
        route: editing.route,
        mainImage: editing.mainImage,
        gallery: editing.gallery,
        highlights: editing.highlights,
        itinerary: editing.itinerary,
        included: editing.included,
        featured: editing.featured,
        hidden: editing.hidden,
        sortOrder: editing.sortOrder,
      }
    : null;

  return (
    <AdminLayout title="Tours Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-gray-400 font-light">
            {tours?.length ?? 0} tours · changes appear instantly on the homepage.
          </p>
          <button
            onClick={() => {
              setError(null);
              setAdding(true);
            }}
            className="bg-primary hover:bg-primary/90 text-black px-5 py-2.5 text-xs uppercase tracking-wider font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Tour
          </button>
        </div>

        {isLoading ? (
          <div className="h-32 flex items-center justify-center border border-white/5 bg-white/5">
            <span className="text-gray-500">Loading tours…</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {tours?.map((tour) => (
              <div
                key={tour.id}
                className="bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col"
              >
                <div className="relative h-40 bg-black">
                  {tour.mainImage ? (
                    <img
                      src={tour.mainImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs uppercase">
                      No image
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/80 border border-white/20 px-2 py-1 text-[10px] font-mono">
                    {tour.slug}
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    {tour.featured && (
                      <span className="bg-primary/15 border border-primary/40 text-primary px-2 py-1 text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    )}
                    {tour.hidden && (
                      <span className="bg-gray-500/20 border border-gray-500/40 text-gray-300 px-2 py-1 text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Hidden
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-serif text-white truncate">{tour.title}</h3>
                    <span className="text-primary text-sm whitespace-nowrap">
                      ${tour.startingPrice}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs mb-3">
                    {tour.duration || "—"}
                  </div>
                  <p className="text-gray-400 text-xs font-light line-clamp-2 mb-4 flex-1">
                    {tour.shortDescription || "No description."}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500 mb-3">
                    {tour.hidden ? (
                      <span className="flex items-center gap-1 text-gray-500">
                        <EyeOff className="w-3 h-3" /> Hidden
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-400/80">
                        <Eye className="w-3 h-3" /> Visible
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setError(null);
                        setEditing(tour);
                      }}
                      className="flex-1 border border-white/20 hover:bg-white/5 text-xs uppercase tracking-wider py-2 flex items-center justify-center gap-2"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setConfirmDel(tour)}
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

      <ModalShell open={adding} title="Add New Tour" onClose={() => setAdding(false)} wide>
        {error && (
          <div className="mb-4 px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}
        <TourForm
          initial={EMPTY}
          pending={createT.isPending}
          onSubmit={handleCreate}
          onCancel={() => setAdding(false)}
        />
      </ModalShell>

      <ModalShell
        open={!!editing}
        title={`Edit ${editing?.slug ?? ""}`}
        onClose={() => setEditing(null)}
        wide
      >
        {error && (
          <div className="mb-4 px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}
        {initialForEdit && (
          <TourForm
            initial={initialForEdit}
            pending={updateT.isPending}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </ModalShell>

      <ConfirmDialog
        open={!!confirmDel}
        title="Delete tour?"
        message={`This will permanently remove "${confirmDel?.title ?? ""}" from the homepage. This action cannot be undone.`}
        onClose={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        pending={deleteT.isPending}
      />
    </AdminLayout>
  );
}
