import { X, ArrowUp, ArrowDown, Star } from "lucide-react";
import type {
  TourDeparture,
  TourReview,
  TourFaqItem,
} from "@workspace/api-client-react";
import { LocalizedField } from "./LocalizedField";

const inputCls =
  "w-full bg-black border border-white/10 px-3 py-2 text-white text-sm focus:border-primary focus:outline-none";
const labelCls = "block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5";

function genId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function DeparturesEditor({
  value,
  onChange,
}: {
  value: TourDeparture[];
  onChange: (v: TourDeparture[]) => void;
}) {
  const update = (i: number, patch: Partial<TourDeparture>) =>
    onChange(value.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const c = [...value];
    [c[i], c[j]] = [c[j]!, c[i]!];
    onChange(c);
  };
  const sorted = [...value].sort((a, b) =>
    (a.startDate || "").localeCompare(b.startDate || ""),
  );
  return (
    <div className="space-y-2">
      {value.length === 0 && (
        <div className="text-xs text-gray-500 italic px-3 py-2 border border-dashed border-white/10">
          No departures yet. Add one below.
        </div>
      )}
      {value.map((d, i) => (
        <div
          key={d.id}
          className="grid grid-cols-12 gap-2 items-end border border-white/10 bg-black/40 p-3"
        >
          <div className="col-span-12 sm:col-span-3">
            <label className={labelCls}>Start date</label>
            <input
              type="date"
              value={d.startDate}
              onChange={(e) => update(i, { startDate: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="col-span-12 sm:col-span-3">
            <label className={labelCls}>End date</label>
            <input
              type="date"
              value={d.endDate}
              onChange={(e) => update(i, { endDate: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="col-span-6 sm:col-span-1">
            <label className={labelCls}>Seats</label>
            <input
              type="number"
              min={0}
              value={d.seats}
              onChange={(e) =>
                update(i, { seats: parseInt(e.target.value, 10) || 0 })
              }
              className={inputCls}
            />
          </div>
          <div className="col-span-6 sm:col-span-2">
            <label className={labelCls}>Price (USD)</label>
            <input
              type="number"
              min={0}
              value={d.price}
              onChange={(e) =>
                update(i, { price: parseInt(e.target.value, 10) || 0 })
              }
              className={inputCls}
            />
          </div>
          <div className="col-span-12 sm:col-span-2">
            <label className={labelCls}>Status</label>
            <select
              value={d.status}
              onChange={(e) =>
                update(i, { status: e.target.value as TourDeparture["status"] })
              }
              className={inputCls}
            >
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="soldout">Sold out</option>
            </select>
          </div>
          <div className="col-span-12 sm:col-span-1 flex items-center gap-1 justify-end">
            <button
              type="button"
              onClick={() => move(i, -1)}
              className="p-1 text-gray-500 hover:text-white"
              title="Move up"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              className="p-1 text-gray-500 hover:text-white"
              title="Move down"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-1 text-red-500 hover:text-red-400"
              title="Remove"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            onChange([
              ...value,
              {
                id: genId(),
                startDate: "",
                endDate: "",
                seats: 8,
                price: 0,
                status: "available",
              },
            ])
          }
          className="px-3 py-1.5 border border-white/15 text-[10px] uppercase tracking-wider text-gray-300 hover:border-primary hover:text-primary"
        >
          + Add Departure
        </button>
        {value.length > 0 && (
          <span className="text-[10px] text-gray-500">
            Sorted display preview: {sorted.map((s) => s.startDate || "—").join(", ")}
          </span>
        )}
      </div>
    </div>
  );
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-primary"
          title={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            className={`w-5 h-5 ${
              n <= value ? "fill-primary text-primary" : "text-gray-600"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-xs text-gray-500">{value}/5</span>
    </div>
  );
}

export function ReviewsEditor({
  value,
  onChange,
}: {
  value: TourReview[];
  onChange: (v: TourReview[]) => void;
}) {
  const update = (i: number, patch: Partial<TourReview>) =>
    onChange(value.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const c = [...value];
    [c[i], c[j]] = [c[j]!, c[i]!];
    onChange(c);
  };
  return (
    <div className="space-y-3">
      {value.map((r, i) => (
        <div
          key={r.id}
          className="border border-white/10 bg-black/40 p-3 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-primary">
              Review #{i + 1}
            </span>
            <div className="flex gap-1">
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
              <button
                type="button"
                onClick={() => remove(i)}
                className="p-1 text-red-500 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Author *</label>
              <input
                value={r.author}
                onChange={(e) => update(i, { author: e.target.value })}
                className={inputCls}
                placeholder="e.g. Sophie M."
              />
            </div>
            <div>
              <label className={labelCls}>Date (optional)</label>
              <input
                type="date"
                value={r.date ?? ""}
                onChange={(e) => update(i, { date: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
          <LocalizedField
            label="Author location (optional)"
            value={r.location}
            onChange={(v) => update(i, { location: v })}
            placeholder="London, UK"
          />
          <div>
            <label className={labelCls}>Rating</label>
            <StarRating
              value={r.rating}
              onChange={(n) => update(i, { rating: n })}
            />
          </div>
          <LocalizedField
            label="Review body *"
            value={r.body}
            onChange={(v) => update(i, { body: v })}
            multiline
            rows={3}
            placeholder="A truly unforgettable journey across the Pamir..."
            required
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([
            ...value,
            { id: genId(), author: "", rating: 5, body: "" },
          ])
        }
        className="px-3 py-1.5 border border-white/15 text-[10px] uppercase tracking-wider text-gray-300 hover:border-primary hover:text-primary"
      >
        + Add Review
      </button>
    </div>
  );
}

export function FaqEditor({
  value,
  onChange,
}: {
  value: TourFaqItem[];
  onChange: (v: TourFaqItem[]) => void;
}) {
  const update = (i: number, patch: Partial<TourFaqItem>) =>
    onChange(value.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const c = [...value];
    [c[i], c[j]] = [c[j]!, c[i]!];
    onChange(c);
  };
  return (
    <div className="space-y-3">
      {value.map((q, i) => (
        <div
          key={q.id}
          className="border border-white/10 bg-black/40 p-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-primary">
              Question #{i + 1}
            </span>
            <div className="flex gap-1">
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
              <button
                type="button"
                onClick={() => remove(i)}
                className="p-1 text-red-500 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <LocalizedField
            label="Question *"
            value={q.question}
            onChange={(v) => update(i, { question: v })}
            placeholder="Is this tour suitable for children?"
            required
          />
          <LocalizedField
            label="Answer *"
            value={q.answer}
            onChange={(v) => update(i, { answer: v })}
            multiline
            rows={3}
            placeholder="Yes — children 8+ are welcome..."
            required
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([
            ...value,
            { id: genId(), question: "", answer: "" },
          ])
        }
        className="px-3 py-1.5 border border-white/15 text-[10px] uppercase tracking-wider text-gray-300 hover:border-primary hover:text-primary"
      >
        + Add FAQ
      </button>
    </div>
  );
}
