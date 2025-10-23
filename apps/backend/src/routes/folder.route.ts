import { t } from "elysia";
import { Elysia } from "elysia";
import { folderService } from "../services/folder.service";

export const folderRoutes = new Elysia({ prefix: "/folders" })

  .get("/", async () => {
    const result = await folderService.list();
    return { data: result };
  })

  .get("/tree", async () => {
    const tree = await folderService.tree();
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

      const result = await folderService.subfolders(parentId);

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
      const inserted = await folderService.create(
        body.name,
        body.parentId ?? null,
      );
      return { success: true, data: inserted };
    },
    {
      body: t.Object({
        name: t.String(),
        parentId: t.Optional(t.Number()),
      }),
    }
  );
