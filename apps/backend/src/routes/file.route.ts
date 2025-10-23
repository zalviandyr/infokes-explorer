import { t } from "elysia";
import { Elysia } from "elysia";
import { db } from "../db/connection";
import { files } from "../db/schema/files";

export const fileRoutes = new Elysia({ prefix: "/files" })

  .get("/", async () => {
    const result = await db.select().from(files);
    return { data: result };
  })

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
