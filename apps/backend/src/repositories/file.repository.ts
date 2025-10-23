import { db } from "../db/connection";
import { files } from "../db/schema/files";

export type NewFile = {
  name: string;
  folderId: number | null;
};

export const fileRepository = {
  findAll: () => db.select().from(files),

  findByFolderId: (folderId: number) =>
    db.query.files.findMany({
      where: (file, { eq }) => eq(file.folderId, folderId),
    }),

  create: async (data: NewFile) => {
    const [inserted] = await db
      .insert(files)
      .values({ name: data.name, folderId: data.folderId })
      .returning();
    return inserted;
  },
};
