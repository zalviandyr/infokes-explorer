import { t } from "elysia";
import { Elysia } from "elysia";
import { fileService } from "../services/file.service";

export const fileRoutes = new Elysia({ prefix: "/files" })

  .get("/", async () => {
    const result = await fileService.list();
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

      const result = await fileService.byFolder(folderId);

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
      const inserted = await fileService.create(body.name, body.folderId);
      return { success: true, data: inserted };
    },
    {
      body: t.Object({
        name: t.String(),
        folderId: t.Number(),
      }),
    }
  );
