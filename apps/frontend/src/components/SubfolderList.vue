<template>
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-3">
      Subfolders of "{{ selectedFolder?.name ?? '—' }}"
    </h2>

    <form class="flex items-center gap-2 mb-4" @submit.prevent="submit">
      <input
        v-model="name"
        type="text"
        placeholder="New folder name"
        class="flex-1 border border-gray-300 rounded px-2 py-1"
      />
      <button
        type="submit"
        class="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
        :disabled="!name.trim() || creating"
      >
        {{ creating ? "Adding..." : "Add" }}
      </button>
    </form>

    <p v-if="error" class="text-sm text-red-600 mb-2">{{ error }}</p>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <ul v-else-if="subfolders.length > 0">
      <li
        v-for="sub in subfolders"
        :key="sub.id"
        class="flex items-center gap-2 py-1 cursor-pointer rounded hover:bg-gray-100"
        @click="open(sub)"
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
import {
  fetchSubfolders,
  createFolder,
  type Folder,
} from "../api/folders";

const props = defineProps<{
  selectedFolder: Folder | null;
}>();

const emit = defineEmits<{
  (e: "open", folder: Folder): void;
  (e: "created", folder: Folder): void;
}>();

const subfolders = ref<Folder[]>([]);
const loading = ref(false);
const creating = ref(false);
const name = ref("");
const error = ref("");

watch(
  () => props.selectedFolder,
  async (folder) => {
    if (!folder) {
      subfolders.value = [];
      loading.value = false;
      name.value = "";
      error.value = "";
      return;
    }
    loading.value = true;
    try {
      subfolders.value = await fetchSubfolders(folder.id);
    } finally {
      loading.value = false;
    }
    name.value = "";
    error.value = "";
  },
  { immediate: true }
);

function open(folder: Folder) {
  emit("open", folder);
}

async function submit() {
  const trimmed = name.value.trim();
  if (!trimmed || creating.value) return;
  creating.value = true;
  error.value = "";
  try {
    const created = await createFolder({
      name: trimmed,
      parentId: props.selectedFolder?.id ?? null,
    });
    name.value = "";
    subfolders.value = [...subfolders.value, created];
    emit("created", created);
    emit("open", created);
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to create folder";
  } finally {
    creating.value = false;
  }
}
</script>
