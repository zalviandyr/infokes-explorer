export interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  children?: Folder[];
}

const API_BASE =
  (import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "/api") + "/v1";

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
