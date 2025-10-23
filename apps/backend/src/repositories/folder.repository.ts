import { db } from "../db/connection";
import { folders } from "../db/schema/folders";

export type FolderRow = typeof folders.$inferSelect;

export type NewFolder = {
  name: string;
  parentId: number | null;
};

export type FolderRepository = {
  findAll: () => Promise<FolderRow[]>;
  findSubfolders: (parentId: number) => Promise<FolderRow[]>;
  create: (data: NewFolder) => Promise<FolderRow>;
};

export const folderRepository: FolderRepository = {
  findAll: async () => db.select().from(folders),

  findSubfolders: async (parentId: number) =>
    db.query.folders.findMany({
      where: (folder, { eq }) => eq(folder.parentId, parentId),
    }),

  create: async (data: NewFolder) => {
    const [inserted] = await db
      .insert(folders)
      .values({ name: data.name, parentId: data.parentId })
      .returning();
    if (!inserted) {
      throw new Error("Failed to insert folder");
    }
    return inserted;
  },
};
