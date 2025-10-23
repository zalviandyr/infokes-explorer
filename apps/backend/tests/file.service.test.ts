import { describe, it, expect } from "bun:test";
import { createFileService } from "../src/services/file.service";
import { files } from "../src/db/schema/files";
import type { FileRepository } from "../src/repositories/file.repository";

type FileRow = typeof files.$inferSelect;

const makeFile = (
  id: number,
  name: string,
  folderId: number | null,
): FileRow => ({
  id,
  name,
  folderId,
  createdAt: new Date(),
});

describe("fileService", () => {
  it("filters files by folder id", async () => {
    const rows: FileRow[] = [
      makeFile(1, "Root File", 1),
      makeFile(2, "Other File", 2),
      makeFile(3, "Another File", 1),
    ];

    const repo: FileRepository = {
      findAll: () => Promise.resolve(rows),
      findByFolderId: (folderId: number) =>
        Promise.resolve(rows.filter((file) => file.folderId === folderId)),
      create: async ({ name, folderId }) =>
        makeFile(rows.length + 1, name, folderId),
    };

    const service = createFileService(repo);

    const result = await service.byFolder(1);
    expect(result.map((file) => file.name)).toEqual([
      "Root File",
      "Another File",
    ]);
  });

  it("creates a file for a folder", async () => {
    const rows: FileRow[] = [];

    const repo: FileRepository = {
      findAll: () => Promise.resolve(rows),
      findByFolderId: (folderId: number) =>
        Promise.resolve(rows.filter((file) => file.folderId === folderId)),
      create: async ({ name, folderId }) => {
        const row = makeFile(rows.length + 1, name, folderId);
        rows.push(row);
        return row;
      },
    };

    const service = createFileService(repo);

    const created = await service.create("Invoice.pdf", 5);
    expect(created.name).toBe("Invoice.pdf");
    expect(created.folderId).toBe(5);
    expect(rows).toContainEqual(created);
  });
});
