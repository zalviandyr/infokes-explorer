import {
  fileRepository,
  type FileRepository,
} from "../repositories/file.repository";

export const createFileService = (
  repo: FileRepository = fileRepository,
) => ({
  list: () => repo.findAll(),

  byFolder: (folderId: number) => repo.findByFolderId(folderId),

  create: (name: string, folderId: number) =>
    repo.create({
      name,
      folderId,
    }),
});

export const fileService = createFileService();
