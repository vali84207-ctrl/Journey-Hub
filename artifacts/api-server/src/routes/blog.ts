import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable, type BlogContentBlock } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateBlogPostBody, UpdateBlogPostBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

function serialize(p: typeof blogPostsTable.$inferSelect) {
  return {
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

router.get("/blog", async (_req, res) => {
  const rows = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.createdAt));
  res.json(rows.map(serialize));
});

router.get("/blog/by-slug/:slug", async (req, res) => {
  const [row] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, String(req.params.slug)));
  if (!row) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json(serialize(row));
});

router.post("/blog", requireAdmin, async (req, res) => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join("; ") });
    return;
  }
  try {
    const [row] = await db
      .insert(blogPostsTable)
      .values({
        ...parsed.data,
        content: (parsed.data.content ?? []) as BlogContentBlock[],
        updatedAt: new Date(),
      })
      .returning();
    res.status(201).json(serialize(row));
  } catch (err) {
    req.log.error({ err }, "Failed to create blog post");
    res.status(400).json({ error: "Failed to create blog post (slug may already exist)" });
  }
});

router.put("/blog/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid post ID" });
    return;
  }
  const parsed = UpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join("; ") });
    return;
  }
  const [row] = await db
    .update(blogPostsTable)
    .set({
      ...parsed.data,
      content: (parsed.data.content ?? []) as BlogContentBlock[],
      updatedAt: new Date(),
    })
    .where(eq(blogPostsTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json(serialize(row));
});

router.delete("/blog/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid post ID" });
    return;
  }
  const [row] = await db
    .delete(blogPostsTable)
    .where(eq(blogPostsTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.status(204).end();
});

export default router;
