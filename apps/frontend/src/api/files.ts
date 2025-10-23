import { API_BASE } from "../config/api";

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
