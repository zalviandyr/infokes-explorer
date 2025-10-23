import {
  fetchFolderTree,
  fetchSubfolders,
  createFolder,
  type Folder,
  type CreateFolderPayload,
} from "../api/folders";

export const folderService = {
  getTree: (): Promise<Folder[]> => fetchFolderTree(),

  getSubfolders: (parentId: number): Promise<Folder[]> =>
    fetchSubfolders(parentId),

  createFolder: (payload: CreateFolderPayload): Promise<Folder> =>
    createFolder(payload),
};

export type { Folder };
