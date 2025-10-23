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

    <template v-else>
      <section class="mb-6">
        <h3 class="font-medium text-gray-700 mb-2">Subfolders</h3>
        <ul v-if="subfolders.length > 0">
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
        <div v-else class="text-gray-500 text-sm">No subfolders found.</div>
      </section>

      <section>
        <h3 class="font-medium text-gray-700 mb-2">Files</h3>
        <ul v-if="files.length > 0">
          <li
            v-for="file in files"
            :key="file.id"
            class="flex items-center gap-2 py-1 rounded"
          >
            <span>📄</span>
            <span>{{ file.name }}</span>
          </li>
        </ul>
        <div v-else class="text-gray-500 text-sm">No files found.</div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  fetchSubfolders,
  fetchFiles,
  createFolder,
  type Folder,
  type ExplorerFile,
} from "../api/folders";

const props = defineProps<{
  selectedFolder: Folder | null;
}>();

const emit = defineEmits<{
  (e: "open", folder: Folder): void;
  (e: "created", folder: Folder): void;
}>();

const subfolders = ref<Folder[]>([]);
const files = ref<ExplorerFile[]>([]);
const loading = ref(false);
const creating = ref(false);
const name = ref("");
const error = ref("");

watch(
  () => props.selectedFolder,
  async (folder) => {
    if (!folder) {
      subfolders.value = [];
      files.value = [];
      loading.value = false;
      name.value = "";
      error.value = "";
      return;
    }
    loading.value = true;
    try {
      const [subfolderData, fileData] = await Promise.all([
        fetchSubfolders(folder.id),
        fetchFiles(folder.id),
      ]);
      subfolders.value = subfolderData;
      files.value = fileData;
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
