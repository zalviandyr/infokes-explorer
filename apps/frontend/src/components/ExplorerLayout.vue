<template>
  <div class="flex h-screen">
    <!-- Left Panel -->
    <div class="w-1/3 border-r border-gray-300 overflow-y-auto p-4">
      <h2 class="text-xl font-bold mb-2">Folder Tree</h2>
      <FolderTree
        :folders="tree"
        :selected-id="selectedFolder?.id ?? null"
        @select="onSelectFolder"
      />
    </div>

    <!-- Right Panel -->
    <div class="flex-1 overflow-y-auto">
      <SubfolderList :selected-folder="selectedFolder" />
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

async function loadTree() {
  tree.value = await fetchFolderTree();
}

function onSelectFolder(folder: Folder) {
  selectedFolder.value = folder;
}

onMounted(loadTree);
</script>
