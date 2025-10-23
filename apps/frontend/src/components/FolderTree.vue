<template>
  <ul class="pl-4 border-l border-gray-300">
    <li
      v-for="folder in folders"
      :key="folder.id"
      class="cursor-pointer hover:bg-gray-100 p-1 rounded"
    >
      <div
        @click="onSelect(folder)"
        :class="[
          'flex items-center gap-1',
          selectedId === folder.id ? 'font-semibold text-blue-600' : ''
        ]"
      >
        <span>📁</span>
        <span>{{ folder.name }}</span>
      </div>

      <!-- recursive children -->
      <FolderTree
        v-if="folder.children && folder.children.length > 0"
        :folders="folder.children"
        :selected-id="selectedId"
        @select="onSelect"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Folder } from '../api/folders';

defineProps<{
  folders: Folder[];
  selectedId: number | null;
}>();

const emit = defineEmits<{
  (e: "select", folder: Folder): void;
}>();

function onSelect(folder: Folder) {
  emit("select", folder);
}
</script>
