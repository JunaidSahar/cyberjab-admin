<template>
  <div class="bg-darkBackground p-8">
    <!-- Upload Section -->
    <div v-if="!manifest" class="mx-auto max-w-7xl">
      <div class="flex flex-col items-center mb-8 text-center">
        <h1 class="mb-2 font-bold text-headingColor text-4xl">
          CyberJab Data Viewer
        </h1>
        <p class="pb-5 text-headingColor">
          Upload your CyberJab export zip file to view the contents
        </p>
        <button
          @click="exportAllData"
          :disabled="exporting"
          class="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white transition-colors"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          Export
        </button>
      </div>

      <div
        class="bg-darkForeground shadow-xl p-12 border border-gray-700 rounded-lg"
      >
        <label
          class="flex flex-col justify-center items-center p-12 border-2 border-gray-600 border-dashed rounded-lg transition-all duration-300 cursor-pointer"
          :class="
            loading
              ? 'pointer-events-none bg-gray-700/50'
              : 'hover:bg-gray-700/30 hover:border-gray-500'
          "
        >
          <svg
            v-if="!loading"
            class="mb-4 w-16 h-16 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <!-- Loading Spinner -->
          <div v-if="loading" class="mb-4">
            <div class="relative">
              <div
                class="border-indigo-400 border-t-4 border-r-4 border-b-4 border-l-transparent rounded-full w-16 h-16 animate-spin"
              ></div>
              <div
                class="absolute inset-0 border-4 border-indigo-600/30 rounded-full"
              ></div>
            </div>
          </div>

          <span class="mb-2 font-semibold text-white text-xl">
            {{
              loading ? loadingMessage || "Processing..." : "Upload ZIP File"
            }}
          </span>
          <span v-if="!loading" class="text-gray-400 text-sm">
            Click to browse or drag and drop
          </span>
          <input
            type="file"
            accept=".zip"
            @change="handleFileUpload"
            class="hidden"
            :disabled="loading"
          />
        </label>

        <div
          v-if="error"
          class="bg-red-900/50 mt-6 p-4 border border-red-700 rounded-lg"
        >
          <p class="font-medium text-red-300">Error: {{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="mx-auto max-w-7xl">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="mb-2 font-bold text-white text-4xl">
            {{ manifest.metadata.title }}
          </h1>
          <p class="text-gray-300">{{ manifest.metadata.description }}</p>
        </div>
        <div class="flex gap-4">
          <button
          @click="resetData"
          class="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-colors"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear Data
        </button>
        <button
          @click="importData"
          :disabled="importing"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
        >
        <template v-if="importing">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g><circle cx="3" cy="12" r="2" fill="currentColor"/><circle cx="21" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="21" r="2" fill="currentColor"/><circle cx="12" cy="3" r="2" fill="currentColor"/><circle cx="5.64" cy="5.64" r="2" fill="currentColor"/><circle cx="18.36" cy="18.36" r="2" fill="currentColor"/><circle cx="5.64" cy="18.36" r="2" fill="currentColor"/><circle cx="18.36" cy="5.64" r="2" fill="currentColor"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></svg>
        </template>
        <template v-else>
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          </template>
          Import
        </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="gap-6 grid grid-cols-1 md:grid-cols-4 mb-8">
        <div
          class="bg-darkForeground shadow-lg p-6 border border-border rounded-lg"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium text-gray-200 text-sm">Instructors</p>
              <p class="font-bold text-indigo-500 text-3xl">
                {{ manifest.statistics.total_instructors }}
              </p>
            </div>
            <svg
              class="opacity-50 w-12 h-12 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        </div>

        <div
          class="bg-darkForeground shadow-lg p-6 border border-border rounded-lg"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium text-gray-200 text-sm">Modules</p>
              <p class="font-bold text-green-500 text-3xl">
                {{ manifest.statistics.total_modules }}
              </p>
            </div>
            <svg
              class="opacity-50 w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>

        <div
          class="bg-darkForeground shadow-lg p-6 border border-border rounded-lg"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium text-gray-200 text-sm">Lessons</p>
              <p class="font-bold text-purple-500 text-3xl">
                {{ manifest.statistics.total_lessons }}
              </p>
            </div>
            <svg
              class="opacity-50 w-12 h-12 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>

        <div
          class="bg-darkForeground shadow-lg p-6 border border-border rounded-lg"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium text-gray-200 text-sm">Roadmaps</p>
              <p class="font-bold text-orange-500 text-3xl">
                {{ manifest.statistics.total_roadmaps }}
              </p>
            </div>
            <svg
              class="opacity-50 w-12 h-12 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Metadata Card -->
      <div
        class="bg-darkForeground shadow-lg mb-8 p-6 border border-border rounded-lg"
      >
        <h2 class="mb-4 font-bold text-white text-2xl">Export Information</h2>
        <div class="gap-4 grid grid-cols-2 md:grid-cols-3">
          <div>
            <p class="text-gray-400 text-sm">Version</p>
            <p class="font-semibold text-white">{{ manifest.version }}</p>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Export Date</p>
            <p class="font-semibold text-white">
              {{ formatDate(manifest.export_date) }}
            </p>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Organization</p>
            <p class="font-semibold text-white">
              {{ manifest.metadata.organization }}
            </p>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Author</p>
            <p class="font-semibold text-white">
              {{ manifest.metadata.author }}
            </p>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Language</p>
            <p class="font-semibold text-white">
              {{ manifest.metadata.language.toUpperCase() }}
            </p>
          </div>
          <div class="col-span-2 md:col-span-1">
            <p class="mb-2 text-gray-400 text-sm">Tags</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(tag, idx) in manifest.metadata.tags"
                :key="idx"
                class="bg-indigo-900/50 px-3 py-1 border border-indigo-700 rounded-full text-indigo-300 text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div
        class="bg-darkForeground shadow-lg border border-border rounded-lg overflow-hidden"
      >
        <div class="flex border-b border-border">
          <button
            @click="activeTab = 'overview'"
            :class="[
              'flex-1 px-6 py-4 font-semibold transition-colors',
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700',
            ]"
          >
            Overview
          </button>
          <button
            @click="activeTab = 'instructors'"
            :class="[
              'flex-1 px-6 py-4 font-semibold transition-colors',
              activeTab === 'instructors'
                ? 'bg-indigo-600 text-white'
                : 'bg-darkForeground text-gray-300 hover:bg-gray-700',
            ]"
          >
            Instructors ({{ instructors.length }})
          </button>
          <button
            @click="activeTab = 'modules'"
            :class="[
              'flex-1 px-6 py-4 font-semibold transition-colors',
              activeTab === 'modules'
                ? 'bg-indigo-600 text-white'
                : 'bg-darkForeground text-gray-300 hover:bg-gray-700',
            ]"
          >
            Modules ({{ modules.length }})
          </button>
          <button
            @click="activeTab = 'roadmaps'"
            :class="[
              'flex-1 px-6 py-4 font-semibold transition-colors',
              activeTab === 'roadmaps'
                ? 'bg-indigo-600 text-white'
                : 'bg-darkForeground text-gray-300 hover:bg-gray-700',
            ]"
          >
            Roadmaps ({{ roadmaps.length }})
          </button>
        </div>

        <div class="p-6">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <div>
              <h3 class="mb-3 font-bold text-white text-xl">
                Instructors List
              </h3>
              <div class="space-y-2">
                <div
                  v-for="instructor in instructors"
                  :key="instructor.id"
                  class="bg-gray-700 p-3 border border-gray-600 rounded"
                >
                  <p class="font-semibold text-white">{{ instructor.name }}</p>
                  <p class="text-gray-300 text-sm">{{ instructor.email }}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="mb-3 font-bold text-white text-xl">Modules List</h3>
              <div class="space-y-2">
                <div
                  v-for="module in modules"
                  :key="module.id"
                  class="bg-gray-700 p-3 border border-gray-600 rounded"
                >
                  <p class="font-semibold text-white">{{ module.title }}</p>
                  <p class="text-gray-300 text-sm">{{ module.description }}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="mb-3 font-bold text-white text-xl">Roadmaps List</h3>
              <div class="space-y-2">
                <div
                  v-for="roadmap in roadmaps"
                  :key="roadmap.id"
                  class="bg-gray-700 p-3 border border-gray-600 rounded"
                >
                  <p class="font-semibold text-white">{{ roadmap.title }}</p>
                  <p class="text-gray-300 text-sm">{{ roadmap.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Instructors Tab -->
          <div v-if="activeTab === 'instructors'" class="space-y-4">
            <div
              v-for="instructor in instructors"
              :key="instructor.id"
              class="bg-gray-700 p-4 border border-gray-600 rounded-lg"
            >
              <h4 class="mb-2 font-bold text-white text-lg">
                {{ instructor.name }}
              </h4>
              <pre
                class="bg-gray-900 p-4 border border-gray-600 rounded overflow-auto text-gray-300 text-xs"
                >{{ JSON.stringify(instructor, null, 2) }}</pre
              >
            </div>
          </div>

          <!-- Modules Tab -->
          <div v-if="activeTab === 'modules'" class="space-y-4">
            <div
              v-for="module in modules"
              :key="module.id"
              class="bg-gray-700 p-4 border border-gray-600 rounded-lg"
            >
              <h4 class="mb-2 font-bold text-white text-lg">
                {{ module.title }}
              </h4>
              <pre
                class="bg-gray-900 p-4 border border-gray-600 rounded overflow-auto text-gray-300 text-xs"
                >{{ JSON.stringify(module, null, 2) }}</pre
              >
            </div>
          </div>

          <!-- Roadmaps Tab -->
          <div v-if="activeTab === 'roadmaps'" class="space-y-4">
            <div
              v-for="roadmap in roadmaps"
              :key="roadmap.id"
              class="bg-gray-700 p-4 border border-gray-600 rounded-lg"
            >
              <h4 class="mb-2 font-bold text-white text-lg">
                {{ roadmap.title }}
              </h4>
              <pre
                class="bg-gray-900 p-4 border border-gray-600 rounded overflow-auto text-gray-300 text-xs"
                >{{ JSON.stringify(roadmap, null, 2) }}</pre
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Custom Toast -->
    <transition name="fade">
      <div
        v-if="toast.visible"
        :class="[
          'fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg text-sm font-medium z-50',
          toast.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white',
        ]"
      >
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import JSZip from "jszip";
import { useImportExport } from "#imports";
const { importFile, exportData } = useImportExport();
const toast = ref({ visible: false, message: "", type: "success" });
const showToast = (message, type) => {
  toast.value = { visible: true, message, type };
  setTimeout(() => (toast.value.visible = false), 5000);
};

const manifest = ref(null);
const instructors = ref([]);
const modules = ref([]);
const roadmaps = ref([]);
const loading = ref(false);
const loadingMessage = ref("");
const error = ref(null);
const activeTab = ref("overview");
const originalFile = ref(null);
const importing = ref(false);
const exporting = ref(false);

const importData = async () => {
  importing.value = true;
  importFile(originalFile.value, (progress) => {
    console.log(`Upload progress: ${progress.progress}%`);
  })
    .then(() => {
      showToast("Import in process. You'll receive a notification on email once import is completed", "success");
    })
    .catch((err) => {
      showToast("Import failed: " + err.message, "error");
    })
    .finally(() => {
      importing.value = false;
    });
};

const exportAllData = async () => {
  exporting.value = true;
  const { data, error } = await exportData();
  if (error) {
    showToast("Export failed: " + error.message, "error");
    return;
  }
  console.log("Export successful:", data);
  showToast(`${data?.message}`, "success");
  exporting.value = false;
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  originalFile.value = file;

  loading.value = true;
  error.value = null;

  try {
    loadingMessage.value = "Processing file...";
    await new Promise((resolve) => setTimeout(resolve, 800));

    const zip = new JSZip();
    const contents = await zip.loadAsync(file);

    loadingMessage.value = "Searching for manifest.json...";
    await new Promise((resolve) => setTimeout(resolve, 600));

    // First, try to find manifest.json in root
    let manifestFile = contents.file("manifest.json");
    let manifestPath = "manifest.json";

    // If not found in root, search in all folders
    if (!manifestFile) {
      const allFiles = Object.keys(contents.files);
      console.log("All files in zip:", allFiles);

      // Look for manifest.json in any folder
      for (const filePath of allFiles) {
        if (
          filePath.endsWith("manifest.json") &&
          !contents.files[filePath].dir
        ) {
          manifestFile = contents.file(filePath);
          manifestPath = filePath;
          console.log("Found manifest.json at:", filePath);
          break;
        }
      }
    }

    if (!manifestFile) {
      throw new Error(
        "manifest.json not found in zip file or any of its folders"
      );
    }

    loadingMessage.value = "Reading manifest...";
    await new Promise((resolve) => setTimeout(resolve, 500));

    const manifestText = await manifestFile.async("text");
    const manifestData = JSON.parse(manifestText);
    manifest.value = manifestData;

    // Get the base path for other files (directory containing manifest.json)
    const basePath = manifestPath.includes("/")
      ? manifestPath.substring(0, manifestPath.lastIndexOf("/") + 1)
      : "";

    loadingMessage.value = "Loading instructor data...";
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Read all instructor files
    const instructorData = [];
    for (const instructor of manifestData.instructors) {
      const instructorFilePath = basePath + instructor.file;
      const instructorFile = contents.file(instructorFilePath);
      if (instructorFile) {
        const text = await instructorFile.async("text");
        instructorData.push(JSON.parse(text));
      }
    }
    instructors.value = instructorData;

    loadingMessage.value = "Loading module data...";
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Read all module files
    const moduleData = [];
    for (const module of manifestData.modules) {
      const moduleFilePath = basePath + module.file;
      const moduleFile = contents.file(moduleFilePath);
      if (moduleFile) {
        const text = await moduleFile.async("text");
        moduleData.push(JSON.parse(text));
      }
    }
    modules.value = moduleData;

    loadingMessage.value = "Loading roadmap data...";
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Read all roadmap files
    const roadmapData = [];
    for (const roadmap of manifestData.roadmaps) {
      const roadmapFilePath = basePath + roadmap.file;
      const roadmapFile = contents.file(roadmapFilePath);
      if (roadmapFile) {
        const text = await roadmapFile.async("text");
        roadmapData.push(JSON.parse(text));
      }
    }
    roadmaps.value = roadmapData;

    loadingMessage.value = "Generating data...";
    await new Promise((resolve) => setTimeout(resolve, 600));

    loading.value = false;
    loadingMessage.value = "";
  } catch (err) {
    error.value = err.message;
    loading.value = false;
    loadingMessage.value = "";
  }
};

const resetData = () => {
  manifest.value = null;
  instructors.value = [];
  modules.value = [];
  roadmaps.value = [];
  error.value = null;
  activeTab.value = "overview";
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>
