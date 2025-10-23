import { fileRepository } from "../repositories/file.repository";

export const fileService = {
  list: () => fileRepository.findAll(),

  byFolder: (folderId: number) => fileRepository.findByFolderId(folderId),

  create: (name: string, folderId: number) =>
    fileRepository.create({
      name,
      folderId,
    }),
};
