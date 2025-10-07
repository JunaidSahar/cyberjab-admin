<template>
  <div class="min-h-screen w-full text-headingColor bg-darkBackground relative">
    <div class="max-w-4xl">
      <!-- Back Link -->
      <div class="flex items-center gap-2 mb-2">
        <NuxtLink
          to="/learning-paths"
          class="flex items-center gap-2 text-headingColor text-sm"
        >
          <Icon name="material-symbols:arrow-back-rounded" size="20" />
          <span class="text-sm">Learning Path</span>
        </NuxtLink>
      </div>

      <!-- Page Title -->
      <h1 class="text-3xl font-medium text-headingColor mb-8">
        {{ isEditMode ? form.name || 'Learning Path' : 'Create a New Learning Path' }}
      </h1>

      <!-- Tabs (only when editing) -->
      <div v-if="isEditMode" class="flex border-b border-[#2E2F34] mb-6">
        <button
          @click="activeTab = 'settings'"
          :class="[ 
            'px-4 py-2 text-lg font-medium',
            activeTab === 'settings'
              ? 'border-b-4 border-headingColor text-headingColor font-semibold'
              : 'text-[#B2BBC6]'
          ]"
        >
          Settings
        </button>

        <button
          @click="activeTab = 'modules'"
          :class="[ 
            'px-4 py-2 text-lg font-medium',
            activeTab === 'modules'
              ? 'border-b-4 border-headingColor text-headingColor font-semibold'
              : 'text-[#B2BBC6]'
          ]"
        >
          Modules
        </button>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'settings'" class="bg-[#1E1F23] rounded-md p-6">
        <h2 class="text-headingColor font-medium text-3xl mb-5">
          Learning Path Information
        </h2>

        <!-- Form -->
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Row 1 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-1 text-lg text-headingColor">Name</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Enter Name"
                class="w-full bg-darkBackground rounded-lg px-3 py-2.5 text-sm text-headingColor"
              />
            </div>
            <div>
              <label class="block mb-1 text-lg text-headingColor">Slug</label>
              <input
                v-model="form.slug"
                type="text"
                placeholder="Enter Slug"
                class="w-full bg-darkBackground rounded-lg px-3 py-2.5 text-sm text-headingColor"
              />
            </div>
          </div>

          <!-- Row 2 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-1 text-lg text-headingColor">Type</label>
              <select
                v-model="form.type"
                class="w-full bg-darkBackground rounded-lg px-3 py-2.5 text-sm text-headingColor"
                required
              >
                <option value="">Select a type</option>
                <option value="role">Role</option>
                <option value="domain">Domain</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 text-lg text-headingColor">Duration Days</label>
              <input
                v-model="form.duration_days"
                type="number"
                placeholder="Enter Duration"
                class="w-full bg-darkBackground rounded-lg px-3 py-2.5 text-sm text-headingColor"
              />
            </div>
          </div>

          <!-- Row 3 -->
          <div>
            <label class="block mb-1 text-lg text-headingColor">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Enter Description"
              class="w-full bg-darkBackground rounded-lg px-3 py-2.5 text-sm text-headingColor"
            ></textarea>
          </div>

          <!-- Button -->
          <div class="pt-2">
            <button
              type="submit"
              class="bg-darkBackground px-5 py-2.5 rounded-lg text-headingColor hover:opacity-90 transition"
            >
              {{ isEditMode ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Modules Tab -->
      <div v-else class="bg-[#1E1F23] rounded-md p-6">
        <div class="flex h-screen">
        <!-- Sidebar -->
          <div class="w-64 bg-gray-800 p-4">
              <h2 class="text-lg font-semibold mb-4">Python Programming</h2>
              <ul class="space-y-2">
                  <li class="flex items-center space-x-2">
                      <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Step 1</span>
                  </li>
                  <li class="flex items-center space-x-2">
                      <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Step 2</span>
                      <span class="text-gray-400 ml-2">(5 min)</span>
                  </li>
                  <li class="flex items-center space-x-2">
                      <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Terminal</span>
                      <span class="text-gray-400 ml-2">(5 min)</span>
                  </li>
              </ul>
              <button class="mt-4 w-full bg-blue-600 text-white py-2 rounded">+ New Step</button>
          </div>

          <!-- Main Content -->
          <div class="flex-1 p-6 overflow-y-auto">
              <h1 class="text-2xl font-bold mb-6">Python Programming</h1>
              <div class="grid grid-cols-2 gap-6">
                  <!-- Card 1 -->
                  <div class="bg-gray-800 rounded-lg overflow-hidden relative">
                      <img src="https://via.placeholder.com/300x200" alt="Python Fundamentals" class="w-full">
                      <div class="p-4">
                          <h3 class="text-lg font-semibold">Python Fundamentals</h3>
                          <p class="text-gray-400 text-sm mt-2">
                              Product Management Masterclass: you will learn with Sarah Johnson - Head of Product Customer Platform Gojek Indonesia.
                          </p>
                      </div>
                      <div class="absolute bottom-2 right-2 text-gray-400 text-xs">Published</div>
                  </div>
                  <!-- Card 2 -->
                  <div class="bg-gray-800 rounded-lg overflow-hidden relative">
                      <img src="https://via.placeholder.com/300x200" alt="Object Oriented with Python" class="w-full">
                      <div class="p-4">
                          <h3 class="text-lg font-semibold">Object Oriented with Python</h3>
                          <p class="text-gray-400 text-sm mt-2">
                              Product Management Masterclass: you will learn with Sarah Johnson - Head of Product Customer Platform Gojek Indonesia.
                          </p>
                      </div>
                      <div class="absolute bottom-2 right-2 text-gray-400 text-xs">Published</div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Custom Toast -->
    <transition name="fade">
      <div
        v-if="toast.visible"
        :class="[ 
          'fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg text-sm font-medium z-50',
          toast.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        ]"
      >
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const config = useRuntimeConfig();

const activeTab = ref("settings");
const isEditMode = route.params.slug !== "create";

const form = ref({
  name: "",
  slug: "",
  description: "",
  type: "",
  duration_days: "",
});

// ✅ Toast
const toast = ref({ visible: false, message: "", type: "success" });
const showToast = (message, type = "success") => {
  toast.value = { visible: true, message, type };
  setTimeout(() => (toast.value.visible = false), 2500);
};

// ✅ Fetch data in edit mode
onMounted(async () => {
  if (isEditMode) {
    try {
      const res = await fetch(`${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`);
      const data = await res.json();
      form.value = data;
    } catch (err) {
      showToast("Failed to load learning path", "error");
    }
  }
});

// ✅ Save or update
const handleSubmit = async () => {
  const url = isEditMode
    ? `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`
    : `${config.public.API_BASE_URL}api/lms/roadmaps/`;

  const method = isEditMode ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });

    if (!res.ok) throw new Error("Save failed");
    showToast(isEditMode ? "Updated successfully!" : "Saved successfully!");
  } catch {
    showToast("Network error while saving.", "error");
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
