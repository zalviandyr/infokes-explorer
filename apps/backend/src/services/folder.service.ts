import { folderRepository } from "../repositories/folder.repository";
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

export const folderService = {
  list: () => folderRepository.findAll(),

  tree: async (): Promise<FolderTreeNode[]> => {
    const all = await folderRepository.findAll();
    return buildTree(all, null);
  },

  subfolders: (parentId: number) => folderRepository.findSubfolders(parentId),

  create: (name: string, parentId: number | null) =>
    folderRepository.create({
      name,
      parentId,
    }),
};
