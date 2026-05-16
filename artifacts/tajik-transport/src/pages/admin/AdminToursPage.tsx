import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListTours,
  getListToursQueryKey,
  useCreateTour,
  useUpdateTour,
  useDeleteTour,
  useAutoGenerateTourDepartures,
  type Tour,
  type TourInput,
  type TourHighlight,
  type TourItineraryDay,
  type TourDeparture,
  type TourReview,
  type TourFaqItem,
} from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, X, ArrowUp, ArrowDown } from "lucide-react";
import { AdminLayout, ModalShell, ConfirmDialog } from "@/components/admin/AdminLayout";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { GalleryUploadField } from "@/components/admin/GalleryUploadField";
import { I18nField } from "@/components/admin/I18nField";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { DeparturesEditor, ReviewsEditor, FaqEditor } from "@/components/admin/TourExtrasEditors";
import { pickLocale, type LocalizedString } from "@/lib/locale";

const EMPTY: TourInput = {
  slug: "",
  title: "",
  shortDescription: "",
  description: "",
  duration: "",
  durationDays: 0,
  groupSize: "",
  startingPrice: 0,
  route: "",
  mainImage: "",
  gallery: [],
  highlights: [],
  itinerary: [],
  included: [],
  departures: [],
  reviews: [],
  faq: [],
  featured: true,
  hidden: false,
  sortOrder: 0,
  titleI18n: {},
  shortDescriptionI18n: {},
  descriptionI18n: {},
  durationI18n: {},
  routeI18n: {},
  groupSizeI18n: {},
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

function HighlightsEditor({
  value,
  onChange,
}: {
  value: TourHighlight[];
  onChange: (v: TourHighlight[]) => void;
}) {
  const update = (i: number, patch: Partial<TourHighlight>) =>
    onChange(value.map((h, idx) => (idx === i ? { ...h, ...patch } : h)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const c = [...value];
    [c[i], c[j]] = [c[j], c[i]];
    onChange(c);
  };
  return (
    <div className="space-y-3">
      {value.map((h, i) => (
        <div key={i} className="border border-white/10 bg-black/40 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-primary">
              Highlight #{i + 1}
            </span>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} className="p-1 text-gray-500 hover:text-white">
                <ArrowUp className="w-3 h-3" />
              </button>
              <button type="button" onClick={() => move(i, 1)} className="p-1 text-gray-500 hover:text-white">
                <ArrowDown className="w-3 h-3" />
              </button>
              <button type="button" onClick={() => remove(i)} className="p-1 text-red-500 hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <LocalizedField
            label="Title"
            value={h.title}
            onChange={(v) => update(i, { title: v })}
            placeholder="e.g. Wakhan Corridor"
            required
          />
          <LocalizedField
            label="Body"
            value={h.body}
            onChange={(v) => update(i, { body: v })}
            multiline
            rows={2}
            placeholder="Two unhurried days through the Wakhan."
            required
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { title: "", body: "" }])}
        className="px-3 py-1.5 border border-white/15 text-[10px] uppercase tracking-wider text-gray-300 hover:border-primary hover:text-primary"
      >
        + Add Highlight
      </button>
    </div>
  );
}

function LocalizedListEditor({
  value,
  onChange,
  placeholder,
}: {
  value: LocalizedString[];
  onChange: (v: LocalizedString[]) => void;
  placeholder?: string;
}) {
  const update = (i: number, v: LocalizedString) =>
    onChange(value.map((x, idx) => (idx === i ? v : x)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1">
            <LocalizedField
              compact
              value={item}
              onChange={(v) => update(i, v)}
              placeholder={placeholder}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-2 text-red-500 hover:text-red-400 mt-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="px-3 py-1.5 border border-white/15 text-[10px] uppercase tracking-wider text-gray-300 hover:border-primary hover:text-primary"
      >
        + Add Item
      </button>
    </div>
  );
}

function ItineraryEditor({
  value,
  onChange,
}: {
  value: TourItineraryDay[];
  onChange: (v: TourItineraryDay[]) => void;
}) {
  const update = (i: number, patch: Partial<TourItineraryDay>) =>
    onChange(value.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const c = [...value];
    [c[i], c[j]] = [c[j], c[i]];
    onChange(c);
  };
  return (
    <div className="space-y-4">
      {value.map((d, i) => (
        <div key={i} className="border border-white/10 bg-black/40 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-primary font-serif text-lg">Day</span>
              <input
                type="number"
                value={d.day}
                onChange={(e) => update(i, { day: parseInt(e.target.value, 10) || 1 })}
                className="w-16 bg-black border border-white/10 px-2 py-1 text-white text-sm"
              />
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} className="p-1 text-gray-500 hover:text-white">
                <ArrowUp className="w-3 h-3" />
              </button>
              <button type="button" onClick={() => move(i, 1)} className="p-1 text-gray-500 hover:text-white">
                <ArrowDown className="w-3 h-3" />
              </button>
              <button type="button" onClick={() => remove(i)} className="p-1 text-red-500 hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <LocalizedField
            label="Title"
            value={d.title}
            onChange={(v) => update(i, { title: v })}
            placeholder="Dushanbe → Kalaikhum"
            required
          />
          <LocalizedField
            label="Body / Description"
            value={d.body}
            onChange={(v) => update(i, { body: v })}
            multiline
            rows={3}
            placeholder="Airport pickup, scenic drive east..."
            required
          />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
              Locations visited
            </div>
            <LocalizedListEditor
              value={d.locations ?? []}
              onChange={(v) => update(i, { locations: v })}
              placeholder="e.g. Kalaikhum"
            />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
              Activities
            </div>
            <LocalizedListEditor
              value={d.activities ?? []}
              onChange={(v) => update(i, { activities: v })}
              placeholder="e.g. River walk, traditional dinner"
            />
          </div>
          <LocalizedField
            label="Overnight"
            value={d.overnightLocation}
            onChange={(v) => update(i, { overnightLocation: v })}
            placeholder="e.g. Karon Palace, Kalaikhum"
          />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
              Day images
            </div>
            <GalleryUploadField
              label=""
              value={d.images ?? []}
              onChange={(arr) => update(i, { images: arr })}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([
            ...value,
            { day: value.length + 1, title: "", body: "", locations: [], activities: [], images: [] },
          ])
        }
        className="px-4 py-2 border border-white/15 text-[10px] uppercase tracking-wider text-gray-300 hover:border-primary hover:text-primary"
      >
        + Add Day
      </button>
    </div>
  );
}

function AutoGenerateDeparturesButton({
  tourId,
  onGenerated,
}: {
  tourId: number;
  onGenerated: (tour: Tour) => void;
}) {
  const mutation = useAutoGenerateTourDepartures();
  return (
    <div className="mb-5 flex items-center justify-between gap-3 px-4 py-3 border border-primary/30 bg-primary/5">
      <div className="text-xs text-gray-300">
        <div className="text-primary text-[10px] uppercase tracking-widest mb-1">
          Auto-generate departures
        </div>
        Fills the next 30 days with back-to-back departures based on this tour&apos;s
        Duration (days). Existing departures are preserved.
      </div>
      <button
        type="button"
        disabled={mutation.isPending}
        onClick={() => {
          mutation.mutate(
            { id: tourId },
            {
              onSuccess: (tour) => {
                onGenerated(tour as Tour);
              },
            },
          );
        }}
        className="bg-primary hover:bg-primary/90 text-black px-4 py-2 text-[10px] uppercase tracking-wider font-medium disabled:opacity-50 whitespace-nowrap"
      >
        {mutation.isPending ? "Generating…" : "Generate next 30 days"}
      </button>
    </div>
  );
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
  const [included, setIncluded] = useState<LocalizedString[]>(initial.included ?? []);
  const [highlights, setHighlights] = useState<TourHighlight[]>(initial.highlights ?? []);
  const [itinerary, setItinerary] = useState<TourItineraryDay[]>(initial.itinerary ?? []);
  const [departures, setDepartures] = useState<TourDeparture[]>(initial.departures ?? []);
  const [reviews, setReviews] = useState<TourReview[]>(initial.reviews ?? []);
  const [faq, setFaq] = useState<TourFaqItem[]>(initial.faq ?? []);

  useEffect(() => {
    setData(initial);
    setGalleryText(toLines(initial.gallery));
    setIncluded(initial.included ?? []);
    setHighlights(initial.highlights ?? []);
    setItinerary(initial.itinerary ?? []);
    setDepartures(initial.departures ?? []);
    setReviews(initial.reviews ?? []);
    setFaq(initial.faq ?? []);
  }, [initial]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...data,
          gallery: fromLines(galleryText),
          included,
          highlights,
          itinerary,
          departures,
          reviews,
          faq,
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
          <I18nField
            value={data.titleI18n}
            onChange={(v) => setData({ ...data, titleI18n: v })}
            enPreview={data.title}
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
          <I18nField
            value={data.durationI18n}
            onChange={(v) => setData({ ...data, durationI18n: v })}
            enPreview={data.duration ?? ""}
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
        <div>
          <label className={labelCls}>
            Duration (days, for auto-generated departures)
          </label>
          <input
            type="number"
            min={0}
            value={data.durationDays ?? 0}
            onChange={(e) =>
              setData({ ...data, durationDays: parseInt(e.target.value, 10) || 0 })
            }
            className={inputCls}
            placeholder="7"
          />
          <p className="text-[10px] text-gray-500 mt-1">
            Used to auto-create back-to-back departures. Leave 0 to disable auto-generation
            (system will fall back to parsing the duration label).
          </p>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Group size</label>
          <input
            value={data.groupSize ?? ""}
            onChange={(e) => setData({ ...data, groupSize: e.target.value })}
            className={inputCls}
            placeholder="2 – 8 travellers"
          />
          <I18nField
            value={data.groupSizeI18n}
            onChange={(v) => setData({ ...data, groupSizeI18n: v })}
            enPreview={data.groupSize ?? ""}
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
          <I18nField
            value={data.routeI18n}
            onChange={(v) => setData({ ...data, routeI18n: v })}
            enPreview={data.route ?? ""}
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
        <I18nField
          multiline
          rows={2}
          value={data.shortDescriptionI18n}
          onChange={(v) => setData({ ...data, shortDescriptionI18n: v })}
          enPreview={data.shortDescription ?? ""}
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
        <I18nField
          multiline
          rows={4}
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
      />

      <div>
        <h3 className="font-serif text-base text-primary mb-3">Tour Highlights</h3>
        <HighlightsEditor value={highlights} onChange={setHighlights} />
      </div>

      <div>
        <h3 className="font-serif text-base text-primary mb-3">Day-by-Day Itinerary</h3>
        <ItineraryEditor value={itinerary} onChange={setItinerary} />
      </div>

      <div>
        <h3 className="font-serif text-base text-primary mb-3">What's Included</h3>
        <LocalizedListEditor
          value={included}
          onChange={setIncluded}
          placeholder="e.g. Private Land Cruiser 300 + chauffeur"
        />
      </div>

      <div>
        <h3 className="font-serif text-base text-primary mb-3">Dates &amp; Prices</h3>
        <p className="text-xs text-gray-500 mb-3">
          Add scheduled departures with pricing and availability. These appear on the public tour page.
        </p>
        <DeparturesEditor value={departures} onChange={setDepartures} />
      </div>

      <div>
        <h3 className="font-serif text-base text-primary mb-3">Traveller Reviews</h3>
        <ReviewsEditor value={reviews} onChange={setReviews} />
      </div>

      <div>
        <h3 className="font-serif text-base text-primary mb-3">FAQ</h3>
        <FaqEditor value={faq} onChange={setFaq} />
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
        durationDays: editing.durationDays ?? 0,
        groupSize: editing.groupSize,
        startingPrice: editing.startingPrice,
        route: editing.route,
        mainImage: editing.mainImage,
        gallery: editing.gallery,
        highlights: editing.highlights,
        itinerary: editing.itinerary,
        included: editing.included,
        departures: editing.departures,
        reviews: editing.reviews,
        faq: editing.faq,
        featured: editing.featured,
        hidden: editing.hidden,
        sortOrder: editing.sortOrder,
        titleI18n: editing.titleI18n,
        shortDescriptionI18n: editing.shortDescriptionI18n,
        descriptionI18n: editing.descriptionI18n,
        durationI18n: editing.durationI18n,
        routeI18n: editing.routeI18n,
        groupSizeI18n: editing.groupSizeI18n,
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
                    <img src={tour.mainImage} alt="" className="w-full h-full object-cover" />
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
                  <div className="text-gray-500 text-xs mb-3">{tour.duration || "—"}</div>
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
                    {(tour.itinerary?.length ?? 0) > 0 && (
                      <span>· {tour.itinerary?.length ?? 0} day itinerary</span>
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
        {editing && (
          <AutoGenerateDeparturesButton
            tourId={editing.id}
            onGenerated={(updated) => {
              setEditing(updated);
              refresh();
            }}
          />
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
        message={`This will permanently remove "${pickLocale(confirmDel?.title ?? "", "en")}" from the homepage. This action cannot be undone.`}
        onClose={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        pending={deleteT.isPending}
      />
    </AdminLayout>
  );
}
