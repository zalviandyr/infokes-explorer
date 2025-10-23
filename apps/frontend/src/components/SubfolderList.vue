<template>
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-3">
      Subfolders of "{{ selectedFolder?.name ?? '—' }}"
    </h2>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <ul v-else-if="subfolders.length > 0">
      <li
        v-for="sub in subfolders"
        :key="sub.id"
        class="flex items-center gap-2 py-1"
      >
        <span>📁</span>
        <span>{{ sub.name }}</span>
      </li>
    </ul>

    <div v-else class="text-gray-500">No subfolders found.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchSubfolders, type Folder } from "../api/folders";

const props = defineProps<{
  selectedFolder: Folder | null;
}>();

const subfolders = ref<Folder[]>([]);
const loading = ref(false);

watch(
  () => props.selectedFolder,
  async (folder) => {
    if (!folder) {
      subfolders.value = [];
      return;
    }
    loading.value = true;
    subfolders.value = await fetchSubfolders(folder.id);
    loading.value = false;
  },
  { immediate: true }
);
</script>
