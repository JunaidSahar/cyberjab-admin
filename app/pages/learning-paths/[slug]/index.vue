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
            <h2 class="text-lg font-semibold mb-4"></h2>
            <draggable
              v-model="steps"
              group="steps"
              item-key="step_name"
              handle=".drag-handle"
              @end="onStepDragEnd"
              class="space-y-2"
            >
              <template #item="{ element: step, index }">
                <div
                  @click="selectStep(step)"
                  :class="[
                    'flex justify-between items-center px-4 py-2 bg-[#1E1F23] rounded-lg cursor-pointer transition-all',
                    selectedStep?.step_name === step.step_name ? 'ring-2 ring-headingColor' : ''
                  ]"
                >
                  <div class="flex items-center gap-3 flex-1">
                    <Icon
                      name="material-symbols:drag-indicator"
                      class="w-5 h-5 text-headingColor cursor-grab hover:cursor-grabbing hover:text-blue-500 drag-handle"
                    />
                    <div class="flex flex-col flex-1">
                      <span>{{ step.step_name }}</span>
                      <span class="text-gray-400 text-sm">{{ step.modules?.length || 0 }} module{{ step.modules?.length !== 1 ? 's' : '' }}</span>
                    </div>
                  </div>
                  <div 
                    @click.stop="deleteStep(step, index)"
                    class="flex items-center gap-1 cursor-pointer hover:text-red-500"
                  >
                    <Icon name="material-symbols:delete-outline-rounded" class="w-5 h-5" />
                  </div>
                </div>
              </template>
            </draggable>

            <button
              @click="openNewStepModal"
              class="mt-4 w-full bg-[#1E1F23] hover:bg-[#25272B] text-white py-3 rounded-lg transition-all"
            >
              + New Step
            </button>
          </div>

          <!-- Main Content -->
          <div class="flex-1 bg-darkBackground text-white px-6 pt-4">
            <!-- Heading -->
            <div v-if="selectedStep" class="mb-6">
              <h1
                class="text-3xl font-bold text-headingColor bg-[#1E1F23] py-3 px-4 rounded-xl"
              >
                {{ selectedStep.step_name }}
              </h1>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-12">
              <p class="text-gray-400">Loading modules...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="!selectedStep" class="text-center py-12">
              <p class="text-gray-400">Select a step to view modules</p>
            </div>

            <!-- Cards container -->
            <div v-else-if="selectedStep.modules && selectedStep.modules.length > 0" class="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Card -->
              <div
                v-for="module in selectedStep.modules"
                :key="module.id"
                class="bg-darkForground rounded-xl overflow-hidden flex flex-col"
              >
                <img
                  :src="module.image || '/images/courseImage.png'"
                  :alt="module.name"
                  class="w-full h-48 object-cover"
                />
                <div class="space-y-2 p-4 flex flex-col flex-1 pb-4">
                  <h3 class="font-bold text-lg text-white">{{ module.name }}</h3>
                  <p class="text-sm text-gray-300 flex-1">
                    {{ module.description || 'No description available' }}
                  </p>
                </div>

                <div
                  class="relative flex justify-between items-center bg-[#292D32] px-4 py-2 border-[#303347] border-r-2 border-b-2 border-l-2 rounded-bl-xl rounded-br-xl"
                >
                  <p class="text-gray-400 italic capitalize">{{ module.status || 'Published' }}</p>
                  <div class="relative">
                    <!-- Dots button -->
                    <div
                      @click="toggleMenu(module.id)"
                      class="flex justify-center items-center hover:bg-darkBackground rounded-full w-8 h-8 cursor-pointer"
                    >
                      <Icon name="tabler:dots-vertical" class="w-5 h-5 text-gray-400" />
                    </div>

                    <!-- Dropdown menu -->
                    <div
                      v-if="activeMenuId === module.id"
                      class="absolute right-0 mt-2 w-36 bg-[#1E1F23] border border-[#303347] rounded-lg shadow-lg z-50"
                    >
                      <NuxtLink
                        :to="`/modules/${module.id}/edit`"
                        class="flex items-center gap-2 px-3 py-2 hover:bg-darkBackground text-headingColor text-sm transition-all cursor-pointer"
                      >
                        <Icon name="material-symbols:edit-outline" />
                        <span>Edit</span>
                      </NuxtLink>

                      <div
                        @click="deleteModule(module)"
                        class="flex items-center gap-2 px-3 py-2 hover:bg-darkBackground text-red-400 text-sm transition-all cursor-pointer"
                      >
                        <Icon name="material-symbols:delete-outline-rounded" />
                        <span>Delete</span>
                      </div>

                      <div
                        class="flex items-center gap-2 px-3 py-2 hover:bg-darkBackground text-headingColor text-sm transition-all cursor-pointer"
                      >
                        <Icon name="material-symbols:arrow-upload-progress" />
                        <span>Publish</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No modules in step -->
            <div v-else class="text-center py-12">
              <p class="text-gray-400">No modules in this step</p>
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

    <!-- New Step Modal -->
    <transition name="fade">
      <div
        v-if="showNewStepModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeNewStepModal"
      >
        <div class="bg-[#1E1F23] rounded-lg p-6 w-96">
          <h2 class="text-xl font-semibold text-headingColor mb-4">Create New Step</h2>
          <form @submit.prevent="createNewStep">
            <div class="mb-4">
              <label class="block mb-2 text-sm text-headingColor">Step Name</label>
              <input
                v-model="newStepName"
                type="text"
                placeholder="Enter step name"
                class="w-full bg-darkBackground rounded-lg px-3 py-2.5 text-sm text-headingColor"
                required
              />
            </div>
            <div class="flex gap-3 justify-end">
              <button
                type="button"
                @click="closeNewStepModal"
                class="px-4 py-2 rounded-lg text-gray-400 hover:bg-darkBackground transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg bg-headingColor text-darkBackground hover:opacity-90 transition"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import draggable from "vuedraggable";

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

// ✅ Backend Integration for Modules
const steps = ref([]);
const selectedStep = ref(null);
const loading = ref(false);
const activeMenuId = ref(null);
const showNewStepModal = ref(false);
const newStepName = ref("");

// ✅ Toast
const toast = ref({ visible: false, message: "", type: "success" });
const showToast = (message, type = "success") => {
  toast.value = { visible: true, message, type };
  setTimeout(() => (toast.value.visible = false), 2500);
};

// ✅ Fetch roadmap data
const fetchRoadmapData = async () => {
  if (!isEditMode) return;
  
  loading.value = true;
  try {
    const res = await fetch(`${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`);
    const data = await res.json();
    
    form.value = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      type: data.type,
      duration_days: data.duration_days,
    };
    
    steps.value = data.steps || [];
    
    // Select first step by default
    if (steps.value.length > 0) {
      selectedStep.value = steps.value[0];
    }
  } catch (err) {
    console.error(err);
    showToast("Failed to load learning path", "error");
  } finally {
    loading.value = false;
  }
};

// ✅ Mounted - fetch data on load
onMounted(() => {
  fetchRoadmapData();
});

// ✅ Select a step
const selectStep = (step) => {
  selectedStep.value = step;
  activeMenuId.value = null; // Close any open menu
};

// ✅ Toggle dropdown menu
const toggleMenu = (moduleId) => {
  activeMenuId.value = activeMenuId.value === moduleId ? null : moduleId;
};

// ✅ Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    activeMenuId.value = null;
  }
});

// ✅ Save or update roadmap settings
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
    
    // Refresh data after update
    if (isEditMode) {
      fetchRoadmapData();
    }
  } catch {
    showToast("Network error while saving.", "error");
  }
};

// ✅ Delete a step
const deleteStep = async (step, index) => {
  if (!confirm(`Are you sure you want to delete "${step.step_name}"?`)) return;

  try {
    // Create updated steps array without the deleted step
    const updatedSteps = steps.value.filter((_, i) => i !== index);
    
    const res = await fetch(
      `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form.value,
          steps: updatedSteps,
        }),
      }
    );

    if (!res.ok) throw new Error("Delete failed");
    
    showToast("Step deleted successfully!");
    fetchRoadmapData();
    
    // Clear selection if deleted step was selected
    if (selectedStep.value?.step_name === step.step_name) {
      selectedStep.value = null;
    }
  } catch (err) {
    console.error(err);
    showToast("Failed to delete step", "error");
  }
};

// ✅ Delete a module
const deleteModule = async (module) => {
  if (!confirm(`Are you sure you want to delete "${module.name}"?`)) return;

  try {
    // Update the selected step's modules
    const updatedModules = selectedStep.value.modules.filter(m => m.id !== module.id);
    const updatedSteps = steps.value.map(step => 
      step.step_name === selectedStep.value.step_name
        ? { ...step, modules: updatedModules }
        : step
    );
    
    const res = await fetch(
      `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form.value,
          steps: updatedSteps,
        }),
      }
    );

    if (!res.ok) throw new Error("Delete failed");
    
    showToast("Module deleted successfully!");
    fetchRoadmapData();
    activeMenuId.value = null;
  } catch (err) {
    console.error(err);
    showToast("Failed to delete module", "error");
  }
};

// ✅ Open new step modal
const openNewStepModal = () => {
  showNewStepModal.value = true;
  newStepName.value = "";
};

// ✅ Close new step modal
const closeNewStepModal = () => {
  showNewStepModal.value = false;
  newStepName.value = "";
};

// ✅ Create new step
const createNewStep = async () => {
  if (!newStepName.value.trim()) return;

  try {
    const newStep = {
      step_name: newStepName.value,
      modules: []
    };

    const updatedSteps = [...steps.value, newStep];
    
    const res = await fetch(
      `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form.value,
          steps: updatedSteps,
        }),
      }
    );

    if (!res.ok) throw new Error("Create failed");
    
    showToast("Step created successfully!");
    fetchRoadmapData();
    closeNewStepModal();
  } catch (err) {
    console.error(err);
    showToast("Failed to create step", "error");
  }
};

// ✅ Watch for tab changes to refresh data
watch(activeTab, (newTab) => {
  if (newTab === 'modules' && isEditMode) {
    fetchRoadmapData();
  }
});

// ✅ Handle step drag end - save new order
const onStepDragEnd = async () => {
  try {
    const res = await fetch(
      `${config.public.API_BASE_URL}api/lms/roadmaps/${route.params.slug}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form.value,
          steps: steps.value,
        }),
      }
    );

    if (!res.ok) throw new Error("Reorder failed");
    showToast("Step order updated successfully!");
  } catch (err) {
    console.error(err);
    showToast("Failed to update step order", "error");
    fetchRoadmapData(); // Revert on error
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