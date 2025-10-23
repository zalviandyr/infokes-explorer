import {
  fetchFiles,
  createFile,
  type ExplorerFile,
  type CreateFilePayload,
} from "../api/files";

export const fileService = {
  getByFolder: (folderId: number): Promise<ExplorerFile[]> =>
    fetchFiles(folderId),

  createFile: (payload: CreateFilePayload): Promise<ExplorerFile> =>
    createFile(payload),
};

export type { ExplorerFile };
