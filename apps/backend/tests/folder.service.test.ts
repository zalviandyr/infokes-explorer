import { describe, it, expect } from "bun:test";
import { createFolderService } from "../src/services/folder.service";
import { folders } from "../src/db/schema/folders";
import type { FolderRepository } from "../src/repositories/folder.repository";

type FolderRow = typeof folders.$inferSelect;

const makeRow = (
  id: number,
  name: string,
  parentId: number | null,
): FolderRow => ({
  id,
  name,
  parentId,
  createdAt: new Date(),
});

describe("folderService", () => {
  it("builds a tree of nested folders", async () => {
    const rows: FolderRow[] = [
      makeRow(1, "Root", null),
      makeRow(2, "Child A", 1),
      makeRow(3, "Child B", 1),
      makeRow(4, "Grandchild", 2),
    ];

    const repo: FolderRepository = {
      findAll: () => Promise.resolve(rows),
      findSubfolders: (parentId: number) =>
        Promise.resolve(rows.filter((row) => row.parentId === parentId)),
      create: async ({ name, parentId }) =>
        makeRow(rows.length + 1, name, parentId),
    };
    const service = createFolderService(repo);

    const tree = await service.tree();
    expect(tree).toHaveLength(1);

    const root = tree[0]!;
    expect(root.children.map((child) => child.name)).toEqual([
      "Child A",
      "Child B",
    ]);

    const firstChild = root.children[0]!;
    const grandChild = firstChild.children[0]!;
    expect(grandChild.name).toBe("Grandchild");
  });

  it("creates a folder through the repository", async () => {
    const rows: FolderRow[] = [];
    const repo: FolderRepository = {
      findAll: () => Promise.resolve(rows),
      findSubfolders: (parentId: number) =>
        Promise.resolve(rows.filter((row) => row.parentId === parentId)),
      create: async ({ name, parentId }) => {
        const row = makeRow(rows.length + 1, name, parentId);
        rows.push(row);
        return row;
      },
    };
    const service = createFolderService(repo);

    const created = await service.create("New Folder", 1);
    expect(created.name).toBe("New Folder");
    expect(created.parentId).toBe(1);
    expect(rows).toContainEqual(created);
  });
});
