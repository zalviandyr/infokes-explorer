import { t } from "elysia";
import { Elysia } from "elysia";
import { db } from "../db/connection";
import { folders } from "../db/schema/folders";

export const folderRoutes = new Elysia({ prefix: "/folders" })

  .get("/", async () => {
    const result = await db.select().from(folders);
    return { data: result };
  })

  .get("/tree", async () => {
    const all = await db.select().from(folders);
    type FolderRow = typeof folders.$inferSelect;
    type FolderNode = FolderRow & { children: FolderNode[] };

    const buildTree = (parentId: FolderRow["parentId"]): FolderNode[] =>
      all
        .filter((f) => f.parentId === parentId)
        .map(
          (f): FolderNode => ({
            ...f,
            children: buildTree(f.id),
          })
        );

    const tree = buildTree(null);
    return { data: tree };
  })

  .get(
    "/:id/subfolders",
    async ({ params, set }) => {
      const parentId = Number.parseInt(params.id, 10);
      if (Number.isNaN(parentId)) {
        set.status = 400;
        return { success: false, message: "Invalid folder id" };
      }

      const result = await db.query.folders.findMany({
        where: (folder, { eq }) => eq(folder.parentId, parentId),
      });

      return { data: result };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  .post(
    "/",
    async ({ body }) => {
      const [inserted] = await db
        .insert(folders)
        .values({ name: body.name, parentId: body.parentId ?? null })
        .returning();
      return { success: true, data: inserted };
    },
    {
      body: t.Object({
        name: t.String(),
        parentId: t.Optional(t.Number()),
      }),
    }
  );
