<template>
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-3">
      Subfolders of "{{ selectedFolder?.name ?? '—' }}"
    </h2>

    <form class="flex items-center gap-2 mb-4" @submit.prevent="submitFolder">
      <input
        v-model="folderName"
        type="text"
        placeholder="New folder name"
        class="flex-1 border border-gray-300 rounded px-2 py-1"
      />
      <button
        type="submit"
        class="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
        :disabled="!folderName.trim() || creatingFolder"
      >
        {{ creatingFolder ? "Adding..." : "Add" }}
      </button>
    </form>

    <p v-if="folderError" class="text-sm text-red-600 mb-2">{{ folderError }}</p>

    <form class="flex items-center gap-2 mb-4" @submit.prevent="submitFile">
      <input
        v-model="fileName"
        type="text"
        placeholder="New file name"
        class="flex-1 border border-gray-300 rounded px-2 py-1"
      />
      <button
        type="submit"
        class="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
        :disabled="!fileName.trim() || creatingFile"
      >
        {{ creatingFile ? "Adding..." : "Add File" }}
      </button>
    </form>

    <p v-if="fileError" class="text-sm text-red-600 mb-2">{{ fileError }}</p>

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
  createFolder,
  type Folder,
} from "../api/folders";
import { createFile, fetchFiles, type ExplorerFile } from "../api/files";

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
const creatingFolder = ref(false);
const folderName = ref("");
const folderError = ref("");
const creatingFile = ref(false);
const fileName = ref("");
const fileError = ref("");

watch(
  () => props.selectedFolder,
  async (folder) => {
    if (!folder) {
      subfolders.value = [];
      files.value = [];
      loading.value = false;
      folderName.value = "";
      folderError.value = "";
      fileName.value = "";
      fileError.value = "";
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
    folderName.value = "";
    folderError.value = "";
    fileName.value = "";
    fileError.value = "";
  },
  { immediate: true }
);

function open(folder: Folder) {
  emit("open", folder);
}

async function submitFolder() {
  const trimmed = folderName.value.trim();
  if (!trimmed || creatingFolder.value) return;
  creatingFolder.value = true;
  folderError.value = "";
  try {
    const created = await createFolder({
      name: trimmed,
      parentId: props.selectedFolder?.id ?? null,
    });
    folderName.value = "";
    subfolders.value = [...subfolders.value, created];
    emit("created", created);
    emit("open", created);
  } catch (err) {
    folderError.value =
      err instanceof Error ? err.message : "Failed to create folder";
  } finally {
    creatingFolder.value = false;
  }
}

async function submitFile() {
  const trimmed = fileName.value.trim();
  const parentId = props.selectedFolder?.id;
  if (!trimmed || creatingFile.value || parentId == null) return;
  creatingFile.value = true;
  fileError.value = "";
  try {
    const created = await createFile({ name: trimmed, folderId: parentId });
    fileName.value = "";
    files.value = [...files.value, created];
  } catch (err) {
    fileError.value =
      err instanceof Error ? err.message : "Failed to create file";
  } finally {
    creatingFile.value = false;
  }
}
</script>
