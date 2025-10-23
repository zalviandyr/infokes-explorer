import { db } from "../db/connection";
import { folders } from "../db/schema/folders";

export type NewFolder = {
  name: string;
  parentId: number | null;
};

export const folderRepository = {
  findAll: () => db.select().from(folders),

  findSubfolders: (parentId: number) =>
    db.query.folders.findMany({
      where: (folder, { eq }) => eq(folder.parentId, parentId),
    }),

  create: async (data: NewFolder) => {
    const [inserted] = await db
      .insert(folders)
      .values({ name: data.name, parentId: data.parentId })
      .returning();
    return inserted;
  },
};
