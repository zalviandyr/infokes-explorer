<template>
  <div class="flex h-screen">
    <!-- Left Panel -->
    <div class="w-1/3 border-r border-gray-300 overflow-y-auto p-4">
      <h2 class="text-xl font-bold mb-2">Folder Tree</h2>
      <FolderTree
        :folders="tree"
        :selected-id="selectedFolder?.id ?? null"
        :expanded-ids="expandedIds"
        @select="onSelectFolder"
        @toggle="toggleFolder"
      />
    </div>

    <!-- Right Panel -->
    <div class="flex-1 overflow-y-auto">
      <SubfolderList
        :selected-folder="selectedFolder"
        @open="handleOpenFromList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchFolderTree, type Folder } from "../api/folders";
import SubfolderList from "./SubfolderList.vue";
import FolderTree from "./FolderTree.vue";

const tree = ref<Folder[]>([]);
const selectedFolder = ref<Folder | null>(null);
const expandedIds = ref<number[]>([]);

async function loadTree() {
  tree.value = await fetchFolderTree();
  const currentId = selectedFolder.value?.id;
  if (currentId != null) {
    const refreshed = findFolderById(tree.value, currentId);
    if (refreshed) {
      selectedFolder.value = refreshed;
    }
    ensureExpandedFor(currentId);
  }
}

function onSelectFolder(folder: Folder) {
  selectedFolder.value = folder;
  ensureExpandedFor(folder.id);
}

function handleOpenFromList(folder: Folder) {
  ensureExpandedFor(folder.id);
  const existing = findFolderById(tree.value, folder.id);
  selectedFolder.value = existing ?? folder;
}

function toggleFolder(id: number) {
  const set = new Set(expandedIds.value);
  if (set.has(id)) {
    set.delete(id);
  } else {
    set.add(id);
  }
  expandedIds.value = Array.from(set);
}

function ensureExpandedFor(targetId: number) {
  const path = findPath(tree.value, targetId);
  if (!path) return;
  const set = new Set(expandedIds.value);
  // expand ancestors so target becomes visible
  path.slice(0, -1).forEach((id: number) => set.add(id));
  expandedIds.value = Array.from(set);
}

function findPath(
  nodes: Folder[],
  targetId: number,
  acc: number[] = [],
): number[] | null {
  for (const node of nodes) {
    const path = [...acc, node.id];
    if (node.id === targetId) return path;
    if (Array.isArray(node.children)) {
      const fromChild: number[] | null = findPath(node.children, targetId, path);
      if (fromChild) return fromChild;
    }
  }
  return null;
}

function findFolderById(nodes: Folder[], targetId: number): Folder | null {
  for (const node of nodes) {
    if (node.id === targetId) return node;
    if (Array.isArray(node.children)) {
      const fromChild = findFolderById(node.children, targetId);
      if (fromChild) return fromChild;
    }
  }
  return null;
}

onMounted(loadTree);
</script>
