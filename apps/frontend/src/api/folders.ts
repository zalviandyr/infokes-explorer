export interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  children?: Folder[];
}

export interface ExplorerFile {
  id: number;
  name: string;
  folderId: number | null;
  createdAt: string;
}

export interface CreateFilePayload {
  name: string;
  folderId: number;
}

const API_BASE = (import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "/api") + "/v1";

export async function fetchFolderTree(): Promise<Folder[]> {
  const res = await fetch(`${API_BASE}/folders/tree`);
  const json = await res.json();
  return json.data;
}

export async function fetchSubfolders(parentId: number): Promise<Folder[]> {
  const res = await fetch(`${API_BASE}/folders/${parentId}/subfolders`);
  const json = await res.json();
  return json.data;
}

export async function fetchFiles(folderId: number): Promise<ExplorerFile[]> {
  const res = await fetch(`${API_BASE}/files/folder/${folderId}`);
  const json = await res.json();
  return json.data;
}

export async function createFile(payload: CreateFilePayload): Promise<ExplorerFile> {
  const res = await fetch(`${API_BASE}/files`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "Failed to create file");
    throw new Error(message || "Failed to create file");
  }

  const json = await res.json();
  return json.data;
}

export interface CreateFolderPayload {
  name: string;
  parentId?: number | null;
}

export async function createFolder(payload: CreateFolderPayload): Promise<Folder> {
  const res = await fetch(`${API_BASE}/folders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      parentId: payload.parentId ?? undefined,
    }),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "Failed to create folder");
    throw new Error(message || "Failed to create folder");
  }

  const json = await res.json();
  return json.data;
}
