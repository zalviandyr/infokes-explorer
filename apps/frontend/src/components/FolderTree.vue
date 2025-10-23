<template>
  <ul class="pl-4 border-l border-gray-300">
    <li
      v-for="folder in folders"
      :key="folder.id"
      class="cursor-pointer hover:bg-gray-100 p-1 rounded"
    >
      <div class="flex items-center gap-1">
        <button
          v-if="hasChildren(folder)"
          type="button"
          class="w-4 text-xs text-gray-500"
          @click.stop="emitToggle(folder.id)"
        >
          {{ isExpanded(folder.id) ? "▼" : "▶" }}
        </button>
        <div
          @click="onSelect(folder)"
          :class="[
            'flex items-center gap-1 flex-1',
            selectedId === folder.id ? 'font-semibold text-blue-600' : ''
          ]"
        >
          <span>📁</span>
          <span>{{ folder.name }}</span>
        </div>
      </div>

      <FolderTree
        v-if="hasChildren(folder) && isExpanded(folder.id)"
        :folders="folder.children ?? []"
        :selected-id="selectedId"
        :expanded-ids="expandedIds"
        @select="onSelect"
        @toggle="emitToggle"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import type { Folder } from "../api/folders";

defineOptions({ name: "FolderTree" });

const props = defineProps<{
  folders: Folder[];
  selectedId: number | null;
  expandedIds?: number[];
}>();

const { folders, selectedId, expandedIds } = toRefs(props);

const expandedSet = computed(() => new Set(expandedIds.value ?? []));

const emit = defineEmits<{
  (e: "select", folder: Folder): void;
  (e: "toggle", folderId: number): void;
}>();

function hasChildren(folder: Folder) {
  return Array.isArray(folder.children) && folder.children.length > 0;
}

function isExpanded(id: number) {
  return expandedSet.value.has(id);
}

function emitToggle(id: number) {
  emit("toggle", id);
}

function onSelect(folder: Folder) {
  emit("select", folder);
}
</script>
