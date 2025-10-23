import {
  folderRepository,
  type FolderRepository,
} from "../repositories/folder.repository";
import { folders } from "../db/schema/folders";

type FolderRow = typeof folders.$inferSelect;
type FolderTreeNode = FolderRow & { children: FolderTreeNode[] };

const buildTree = (nodes: FolderRow[], parentId: number | null): FolderTreeNode[] =>
  nodes
    .filter((node) => node.parentId === parentId)
    .map((node) => ({
      ...node,
      children: buildTree(nodes, node.id),
    }));

export const createFolderService = (
  repo: FolderRepository = folderRepository,
) => ({
  list: () => repo.findAll(),

  tree: async (): Promise<FolderTreeNode[]> => {
    const all = await repo.findAll();
    return buildTree(all, null);
  },

  subfolders: (parentId: number) => repo.findSubfolders(parentId),

  create: (name: string, parentId: number | null) =>
    repo.create({
      name,
      parentId,
    }),
});

export const folderService = createFolderService();
