import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListBlogPosts,
  getListBlogPostsQueryKey,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
  type BlogPost,
  type BlogPostInput,
  type BlogContentBlock,
} from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, GripVertical, X, ArrowUp, ArrowDown } from "lucide-react";
import { AdminLayout, ModalShell, ConfirmDialog } from "@/components/admin/AdminLayout";

const EMPTY: BlogPostInput = {
  slug: "",
  title: "",
  excerpt: "",
  cover: "",
  gallery: [],
  location: "",
  date: new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  readTime: "5 min read",
  author: "Pamir Luxe Editorial",
  category: "Mountain Journeys",
  content: [],
  published: true,
};

const BLOCK_TYPES: BlogContentBlock["type"][] = ["paragraph", "heading", "quote", "image"];

function toLines(arr?: string[] | null) {
  return (arr ?? []).join("\n");
}
function fromLines(text: string): string[] {
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
}

function BlogForm({
  initial,
  pending,
  onSubmit,
  onCancel,
}: {
  initial: BlogPostInput;
  pending: boolean;
  onSubmit: (data: BlogPostInput) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<BlogPostInput>(initial);
  const [galleryText, setGalleryText] = useState(toLines(initial.gallery));
  const [blocks, setBlocks] = useState<BlogContentBlock[]>(initial.content ?? []);

  useEffect(() => {
    setData(initial);
    setGalleryText(toLines(initial.gallery));
    setBlocks(initial.content ?? []);
  }, [initial]);

  const inputCls =
    "w-full bg-black border border-white/10 px-4 py-2.5 text-white text-sm focus:border-primary focus:outline-none";
  const labelCls = "block text-xs uppercase tracking-wider text-gray-400 mb-1.5";

  const updateBlock = (i: number, patch: Partial<BlogContentBlock>) => {
    setBlocks(blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  };
  const removeBlock = (i: number) => setBlocks(blocks.filter((_, idx) => idx !== i));
  const moveBlock = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const copy = [...blocks];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setBlocks(copy);
  };
  const addBlock = (type: BlogContentBlock["type"]) => {
    setBlocks([...blocks, type === "image" ? { type, src: "", caption: "" } : { type, text: "" }]);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...data, gallery: fromLines(galleryText), content: blocks });
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
            className={`${inputCls} font-mono`}
            placeholder="my-new-post"
          />
        </div>
        <div>
          <label className={labelCls}>Date *</label>
          <input
            required
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            className={inputCls}
            placeholder="May 8, 2026"
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Title *</label>
          <input
            required
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input
            value={data.location ?? ""}
            onChange={(e) => setData({ ...data, location: e.target.value })}
            className={inputCls}
            placeholder="Pamir Highway, GBAO"
          />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <input
            value={data.category ?? ""}
            onChange={(e) => setData({ ...data, category: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Read time</label>
          <input
            value={data.readTime ?? ""}
            onChange={(e) => setData({ ...data, readTime: e.target.value })}
            className={inputCls}
            placeholder="5 min read"
          />
        </div>
        <div>
          <label className={labelCls}>Author</label>
          <input
            value={data.author ?? ""}
            onChange={(e) => setData({ ...data, author: e.target.value })}
            className={inputCls}
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            checked={data.published ?? true}
            onChange={(e) => setData({ ...data, published: e.target.checked })}
            className="w-4 h-4 accent-primary"
            id="published"
          />
          <label htmlFor="published" className="text-sm text-gray-300">
            Published (visible on public blog)
          </label>
        </div>
      </div>

      <div>
        <label className={labelCls}>Excerpt / preview</label>
        <textarea
          value={data.excerpt ?? ""}
          onChange={(e) => setData({ ...data, excerpt: e.target.value })}
          rows={2}
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Cover image URL *</label>
        <input
          value={data.cover}
          onChange={(e) => setData({ ...data, cover: e.target.value })}
          className={inputCls}
          placeholder="https://images.unsplash.com/…"
        />
        {data.cover && (
          <div className="mt-2 w-48 h-28 bg-black border border-white/10 overflow-hidden">
            <img src={data.cover} alt="" className="w-full h-full object-cover" />
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
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={labelCls + " mb-0"}>Story content</label>
          <div className="flex gap-2">
            {BLOCK_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => addBlock(t)}
                className="px-3 py-1 border border-white/15 text-[10px] uppercase tracking-wider text-gray-300 hover:border-primary hover:text-primary"
              >
                + {t}
              </button>
            ))}
          </div>
        </div>
        {blocks.length === 0 && (
          <p className="text-gray-600 text-sm italic">No content blocks yet — add one above.</p>
        )}
        <div className="space-y-3">
          {blocks.map((b, i) => (
            <div key={i} className="border border-white/10 bg-black/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-primary flex items-center gap-2">
                  <GripVertical className="w-3 h-3 text-gray-600" /> {b.type}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(i, -1)}
                    className="p-1 text-gray-500 hover:text-white"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(i, 1)}
                    className="p-1 text-gray-500 hover:text-white"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(i)}
                    className="p-1 text-red-500/80 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {b.type === "image" ? (
                <div className="space-y-2">
                  <input
                    value={b.src ?? ""}
                    onChange={(e) => updateBlock(i, { src: e.target.value })}
                    placeholder="Image URL"
                    className={inputCls}
                  />
                  <input
                    value={b.caption ?? ""}
                    onChange={(e) => updateBlock(i, { caption: e.target.value })}
                    placeholder="Caption (optional)"
                    className={inputCls}
                  />
                </div>
              ) : (
                <textarea
                  value={b.text ?? ""}
                  onChange={(e) => updateBlock(i, { text: e.target.value })}
                  rows={b.type === "paragraph" ? 4 : 2}
                  placeholder={b.type === "heading" ? "Section heading" : b.type === "quote" ? "Pull quote text" : "Paragraph text"}
                  className={inputCls}
                />
              )}
            </div>
          ))}
        </div>
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
          {pending ? "Saving…" : "Save Post"}
        </button>
      </div>
    </form>
  );
}

export function AdminBlogPage() {
  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useListBlogPosts();
  const createP = useCreateBlogPost();
  const updateP = useUpdateBlogPost();
  const deleteP = useDeleteBlogPost();

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [confirmDel, setConfirmDel] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });

  const handleCreate = (data: BlogPostInput) => {
    setError(null);
    createP.mutate(
      { data },
      {
        onSuccess: () => {
          refresh();
          setAdding(false);
        },
        onError: (e) => setError((e as Error).message ?? "Failed to create"),
      }
    );
  };
  const handleUpdate = (data: BlogPostInput) => {
    if (!editing) return;
    setError(null);
    updateP.mutate(
      { id: editing.id, data },
      {
        onSuccess: () => {
          refresh();
          setEditing(null);
        },
        onError: (e) => setError((e as Error).message ?? "Failed to update"),
      }
    );
  };
  const handleDelete = () => {
    if (!confirmDel) return;
    deleteP.mutate(
      { id: confirmDel.id },
      {
        onSuccess: () => {
          refresh();
          setConfirmDel(null);
        },
      }
    );
  };

  const initialForEdit: BlogPostInput | null = editing
    ? {
        slug: editing.slug,
        title: editing.title,
        excerpt: editing.excerpt,
        cover: editing.cover,
        gallery: editing.gallery,
        location: editing.location,
        date: editing.date,
        readTime: editing.readTime,
        author: editing.author,
        category: editing.category,
        content: editing.content,
        published: editing.published,
      }
    : null;

  return (
    <AdminLayout title="Blog Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-gray-400 font-light">
            {posts?.length ?? 0} posts · published posts appear immediately on /blog.
          </p>
          <button
            onClick={() => {
              setError(null);
              setAdding(true);
            }}
            className="bg-primary hover:bg-primary/90 text-black px-5 py-2.5 text-xs uppercase tracking-wider font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Post
          </button>
        </div>

        {isLoading ? (
          <div className="h-32 flex items-center justify-center border border-white/5 bg-white/5">
            <span className="text-gray-500">Loading posts…</span>
          </div>
        ) : (
          <div className="space-y-3">
            {posts?.map((p) => (
              <div
                key={p.id}
                className="bg-[#0a0a0a] border border-white/10 flex flex-col sm:flex-row gap-4 p-4"
              >
                <div className="w-full sm:w-32 h-24 bg-black flex-shrink-0 overflow-hidden">
                  {p.cover ? (
                    <img src={p.cover} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs">
                      No cover
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 flex-wrap mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-primary">
                      {p.category}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">
                      {p.date}
                    </span>
                    {!p.published && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-400">
                        Draft
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-white text-lg mb-1 truncate">{p.title}</h3>
                  <p className="text-gray-500 text-xs font-light line-clamp-2">{p.excerpt}</p>
                  <div className="text-gray-600 text-[10px] mt-2 font-mono">/blog/{p.slug}</div>
                </div>
                <div className="flex sm:flex-col gap-2 sm:w-28">
                  <button
                    onClick={() => {
                      setError(null);
                      setEditing(p);
                    }}
                    className="flex-1 border border-white/20 hover:bg-white/5 text-xs uppercase tracking-wider py-2 flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setConfirmDel(p)}
                    className="border border-red-500/30 hover:bg-red-500/10 text-red-400 text-xs uppercase tracking-wider py-2 px-3 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ModalShell open={adding} title="Add New Blog Post" onClose={() => setAdding(false)} wide>
        {error && (
          <div className="mb-4 px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}
        <BlogForm
          initial={EMPTY}
          pending={createP.isPending}
          onSubmit={handleCreate}
          onCancel={() => setAdding(false)}
        />
      </ModalShell>

      <ModalShell
        open={!!editing}
        title={`Edit: ${editing?.title ?? ""}`}
        onClose={() => setEditing(null)}
        wide
      >
        {error && (
          <div className="mb-4 px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}
        {initialForEdit && (
          <BlogForm
            initial={initialForEdit}
            pending={updateP.isPending}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </ModalShell>

      <ConfirmDialog
        open={!!confirmDel}
        title="Delete this post?"
        message={`"${confirmDel?.title ?? ""}" will be permanently removed from the journal. This cannot be undone.`}
        onClose={() => setConfirmDel(null)}
        onConfirm={handleDelete}
        pending={deleteP.isPending}
      />
    </AdminLayout>
  );
}
