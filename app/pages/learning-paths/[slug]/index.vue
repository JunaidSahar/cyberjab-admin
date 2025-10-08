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
      <div v-else>
          <div class="flex bg-darkBackground text-headingColor">
            <!-- Sidebar -->
            <div class="w-[22rem] px-4">
              <!-- 👆 fixed sidebar width -->
              <h2 class="text-lg font-semibold mb-4"></h2>
              <ul class="space-y-2">
                <li class="flex justify-between  px-4 py-2 bg-[#1E1F23] rounded-lg">
                  <div class="flex flex-col">
                    <span>Python Programming</span>
                    <span class="text-gray-400">5 module</span>
                  </div>
                  <div class="flex items-center gap-1 cursor-pointer hover:text-red-500">
                    <Icon name="material-symbols:delete-outline-rounded" class="w-5 h-5" />
                  </div>
                </li>

                <li class="flex justify-between  px-4 py-2 bg-[#1E1F23] rounded-lg">
                  <div class="flex flex-col">
                    <span>Step 2</span>
                    <span class="text-gray-400">1 module</span>
                  </div>
                  <div class="flex items-center gap-1 cursor-pointer hover:text-red-500">
                    <Icon name="material-symbols:delete-outline-rounded" class="w-5 h-5" />
                  </div>
                </li>

                <li class="flex justify-between  px-4 py-2 bg-[#1E1F23] rounded-lg">
                  <div class="flex flex-col">
                    <span>Terminal</span>
                    <span class="text-gray-400">5 min</span>
                  </div>
                  <div class="flex items-center gap-1 cursor-pointer hover:text-red-500">
                    <Icon name="material-symbols:delete-outline-rounded" class="w-5 h-5" />
                  </div>
                </li>
              </ul>

              <button
                class="mt-4 w-full bg-[#1E1F23] hover:bg-[#25272B] text-white py-2 rounded-lg transition-all"
              >
                + New Step
              </button>
            </div>

            <!-- Main Content -->
            <div class="flex-1 bg-darkBackground text-white px-6 pt-4">
              <!-- Heading -->
              <div class="mb-6">
                <h1
                  class="text-3xl font-bold text-headingColor bg-[#1E1F23] py-2 px-4 rounded-xl"
                >
                  Python Programming
                </h1>
              </div>

              <!-- Cards container -->
              <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Card -->
                <div class="bg-darkForground rounded-xl overflow-hidden flex flex-col">
                  <img
                    src="/images/courseImage.png"
                    alt="Python Fundamentals"
                    class="w-full h-48 object-cover"
                  />
                  <div class="space-y-2 p-4 flex flex-col flex-1 pb-4">
                    <h3 class="font-bold text-lg text-white">Python Fundamentals</h3>
                    <p class="text-sm text-gray-300 flex-1">
                      Product Management Masterclass, you will learn with Sarah Johnson -
                      Head of Product Customer Platform Gojek Indonesia.
                    </p>
                  </div>

                  
                  <div
                    class="relative flex justify-between items-center bg-[#292D32] px-4 py-2 border-[#303347] border-r-2 border-b-2 border-l-2 rounded-bl-xl rounded-br-xl"
                  >
                    <p class="text-gray-400 italic capitalize">Published</p>
                    <div class="relative">
                      <!-- Dots button -->
                      <div
                        @click="showMenu = !showMenu"
                        class="flex justify-center items-center hover:bg-darkBackground rounded-full w-8 h-8 cursor-pointer"
                      >
                        <Icon name="tabler:dots-vertical" class="w-5 h-5 text-gray-400" />
                      </div>

                      <!-- Dropdown menu -->
                      <div
                        v-if="showMenu"
                        class="absolute right-0 mt-2 w-36 bg-[#1E1F23] border border-[#303347] rounded-lg shadow-lg z-50"
                      >
                        <NuxtLink
                          class="flex items-center gap-2 px-3 py-2 hover:bg-darkBackground text-headingColor text-sm transition-all cursor-pointer"
                        >
                          <Icon name="material-symbols:edit-outline" />
                          <span>Edit</span>
                        </NuxtLink>

                        <div
                          class="flex items-center gap-2 px-3 py-2 hover:bg-darkBackground text-red-400 text-sm transition-all cursor-pointer"
                        >
                          <Icon name="material-symbols:delete-outline-rounded" />
                          <span>Delete</span>
                        </div>

                        <div
                          class="flex items-center gap-2 px-3 py-2 hover:bg-darkBackground text-headingColor text-sm transition-all cursor-pointer"
                        >
                          <Icon name="material-symbols:arrow-upload-progress" />
                          <span>Upload</span>
                        </div>
                      </div>
                    </div>
                  </div>
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

const showMenu = ref(false);
const closeMenu = () => (showMenu.value = false)
document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) closeMenu()
})

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
