import { t } from "elysia";
import { Elysia } from "elysia";
import { db } from "../db/connection";
import { files } from "../db/schema/files";

export const fileRoutes = new Elysia({ prefix: "/files" })

  .get("/", async () => {
    const result = await db.select().from(files);
    return { data: result };
  })

  .get(
    "/folder/:id",
    async ({ params, set }) => {
      const folderId = Number.parseInt(params.id, 10);
      if (Number.isNaN(folderId)) {
        set.status = 400;
        return { success: false, message: "Invalid folder id" };
      }

      const result = await db.query.files.findMany({
        where: (file, { eq }) => eq(file.folderId, folderId),
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
        .insert(files)
        .values({ name: body.name, folderId: body.folderId ?? null })
        .returning();
      return { success: true, data: inserted };
    },
    {
      body: t.Object({
        name: t.String(),
        folderId: t.Number(),
      }),
    }
  );
