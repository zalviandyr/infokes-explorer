import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SubfolderList from "../SubfolderList.vue";
import { folderService, type Folder } from "../../services/folderService";
import {
  fileService,
  type ExplorerFile,
} from "../../services/fileService";

vi.mock("../../services/folderService", () => ({
  folderService: {
    getSubfolders: vi.fn(),
    createFolder: vi.fn(),
  },
}));

vi.mock("../../services/fileService", () => ({
  fileService: {
    getByFolder: vi.fn(),
    createFile: vi.fn(),
  },
}));

const folderServiceMock = folderService as unknown as {
  getSubfolders: ReturnType<typeof vi.fn>;
  createFolder: ReturnType<typeof vi.fn>;
};

const fileServiceMock = fileService as unknown as {
  getByFolder: ReturnType<typeof vi.fn>;
  createFile: ReturnType<typeof vi.fn>;
};

describe("SubfolderList", () => {
  const selectedFolder: Folder = { id: 1, name: "Root", parentId: null };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("memuat subfolder dan file saat folder dipilih", async () => {
    const subfolders: Folder[] = [
      { id: 2, name: "Design", parentId: 1 },
      { id: 3, name: "Docs", parentId: 1 },
    ];
    const files: ExplorerFile[] = [
      {
        id: 10,
        name: "readme.md",
        folderId: 1,
        createdAt: "2024-01-01",
      },
    ];

    folderServiceMock.getSubfolders.mockResolvedValue(subfolders);
    fileServiceMock.getByFolder.mockResolvedValue(files);

    render(SubfolderList, {
      props: {
        selectedFolder,
      },
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(folderServiceMock.getSubfolders).toHaveBeenCalledWith(
        selectedFolder.id
      );
      expect(fileServiceMock.getByFolder).toHaveBeenCalledWith(
        selectedFolder.id
      );
    });

    await screen.findByText("Design");
    await screen.findByText("readme.md");

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.getByText("Subfolders")).toBeInTheDocument();
    expect(screen.getByText("Files")).toBeInTheDocument();

    for (const subfolder of subfolders) {
      expect(screen.getByText(subfolder.name)).toBeInTheDocument();
    }

    for (const file of files) {
      expect(screen.getByText(file.name)).toBeInTheDocument();
    }
  });

  it("membuat subfolder baru dan mengirim event created serta open", async () => {
    folderServiceMock.getSubfolders.mockResolvedValue([]);
    fileServiceMock.getByFolder.mockResolvedValue([]);

    const createdFolder: Folder = {
      id: 5,
      name: "New Folder",
      parentId: selectedFolder.id,
    };
    folderServiceMock.createFolder.mockResolvedValue(createdFolder);

    const { emitted } = render(SubfolderList, {
      props: {
        selectedFolder,
      },
    });

    await waitFor(() => {
      expect(folderServiceMock.getSubfolders).toHaveBeenCalled();
    });

    await screen.findByText("No subfolders found.");

    const folderForm = screen.getByTestId("new-folder-form");
    const input = within(folderForm).getByPlaceholderText("New folder name");

    await fireEvent.update(input, "New Folder");
    const submitButton = within(folderForm).getByRole("button", { name: "Add" });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(folderServiceMock.createFolder).toHaveBeenCalledWith({
        name: "New Folder",
        parentId: selectedFolder.id,
      });
    });

    await waitFor(() => {
      expect(screen.getByText("New Folder")).toBeInTheDocument();
    });

    const events = emitted<[Folder]>();
    expect(events.created?.[0]?.[0]).toEqual(createdFolder);
    expect(events.open?.[0]?.[0]).toEqual(createdFolder);
  });
});
