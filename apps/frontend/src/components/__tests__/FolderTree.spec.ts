import { render, screen, fireEvent } from "@testing-library/vue";
import { describe, it, expect } from "vitest";
import FolderTree from "../FolderTree.vue";
import type { Folder } from "../../api/folders";

describe("FolderTree", () => {
  const tree: Folder[] = [
    {
      id: 1,
      name: "Root",
      parentId: null,
      children: [
        { id: 2, name: "Child A", parentId: 1 },
        {
          id: 3,
          name: "Child B",
          parentId: 1,
          children: [{ id: 4, name: "Grandchild", parentId: 3 }],
        },
      ],
    },
  ];

  it("menampilkan struktur folder sesuai expandedIds dan menyorot folder terpilih", async () => {
    render(FolderTree, {
      props: {
        folders: tree,
        selectedId: 4,
        expandedIds: [1, 3],
      },
    });

    expect(screen.getByText("Root")).toBeInTheDocument();
    expect(screen.getByText("Child A")).toBeInTheDocument();
    expect(screen.getByText("Child B")).toBeInTheDocument();
    expect(await screen.findByText("Grandchild")).toBeInTheDocument();

    const grandchildNode = screen.getByText("Grandchild").parentElement;
    expect(grandchildNode?.className).toContain("font-semibold");
    expect(grandchildNode?.className).toContain("text-blue-600");
  });

  it("mengirim event toggle saat tombol expand diklik", async () => {
    const { emitted } = render(FolderTree, {
      props: {
        folders: tree,
        selectedId: null,
        expandedIds: [],
      },
    });

    const toggleButton = screen.getByRole("button", { name: "▶" });
    await fireEvent.click(toggleButton);

    const events = emitted<[number]>();
    expect(events.toggle?.[0]?.[0]).toBe(1);
  });

  it("mengirim event select saat folder diklik", async () => {
    const { emitted } = render(FolderTree, {
      props: {
        folders: tree,
        selectedId: null,
        expandedIds: [1],
      },
    });

    const child = await screen.findByText("Child A");
    await fireEvent.click(child);

    const events = emitted<[Folder]>();
    expect(events.select?.[0]?.[0]).toEqual(
      expect.objectContaining({ id: 2, name: "Child A" })
    );
  });
});
