import { API_BASE } from "../config/api";

export interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  children?: Folder[];
}

export interface CreateFolderPayload {
  name: string;
  parentId?: number | null;
}

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
