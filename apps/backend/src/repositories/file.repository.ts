import { db } from "../db/connection";
import { files } from "../db/schema/files";

export type FileRow = typeof files.$inferSelect;

export type NewFile = {
  name: string;
  folderId: number | null;
};

export type FileRepository = {
  findAll: () => Promise<FileRow[]>;
  findByFolderId: (folderId: number) => Promise<FileRow[]>;
  create: (data: NewFile) => Promise<FileRow>;
};

export const fileRepository: FileRepository = {
  findAll: async () => db.select().from(files),

  findByFolderId: async (folderId: number) =>
    db.query.files.findMany({
      where: (file, { eq }) => eq(file.folderId, folderId),
    }),

  create: async (data: NewFile) => {
    const [inserted] = await db
      .insert(files)
      .values({ name: data.name, folderId: data.folderId })
      .returning();
    if (!inserted) {
      throw new Error("Failed to insert file");
    }
    return inserted;
  },
};
