<template>
  <div class="relative bg-darkBackground w-full min-h-screen text-headingColor">
    <div>
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
      <h1 class="mb-8 font-medium text-headingColor text-3xl">
        {{
          isEditMode
            ? form.name || "Learning Path"
            : "Create a New Learning Path"
        }}
      </h1>

      <!-- Tabs (only when editing) -->
      <div
        v-if="isEditMode"
        class="flex space-x-12 mb-6 border-[#2E2F34] border-b"
      >
        <button
          @click="handleTabChange('settings')"
          :class="[
            'py-2 text-lg font-medium',
            activeTab === 'settings'
              ? 'border-b-2 border-headingColor text-headingColor font-semibold'
              : 'text-[#B2BBC6]',
          ]"
        >
          Settings
        </button>

        <button
          @click="handleTabChange('modules')"
          :class="[
            'py-2 text-lg font-medium',
            activeTab === 'modules'
              ? 'border-b-2 border-headingColor text-headingColor font-semibold'
              : 'text-[#B2BBC6]',
          ]"
        >
          Modules
        </button>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'settings'" class="bg-[#1E1F23] p-6 rounded-md">
        <h2 class="mb-5 font-medium text-headingColor text-3xl">
          Learning Path Information
        </h2>

        <!-- Form -->
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Row 1 -->
          <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label class="block mb-1 text-headingColor text-lg">Name</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Enter Name"
                class="bg-darkBackground px-3 py-2.5 rounded-lg w-full text-headingColor text-sm"
              />
            </div>
            <div>
              <label class="block mb-1 text-headingColor text-lg">Slug</label>
              <input
                v-model="form.slug"
                type="text"
                placeholder="Enter Slug"
                class="bg-darkBackground px-3 py-2.5 rounded-lg w-full text-headingColor text-sm"
              />
            </div>
          </div>

          <!-- Row 2 -->
          <div class="gap-6 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label class="block mb-1 text-headingColor text-lg">Type</label>
              <select
                v-model="form.type"
                class="bg-darkBackground px-3 py-2.5 rounded-lg w-full text-headingColor text-sm"
                required
              >
                <option value="">Select a type</option>
                <option value="role">Role</option>
                <option value="domain">Domain</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 text-headingColor text-lg"
                >Duration Days</label
              >
              <input
                v-model="form.duration_days"
                type="number"
                placeholder="Enter Duration"
                class="bg-darkBackground px-3 py-2.5 rounded-lg w-full text-headingColor text-sm"
              />
            </div>
          </div>

          <!-- Row 3 -->
          <div>
            <label class="block mb-1 text-headingColor text-lg"
              >Description</label
            >
            <textarea
              v-model="form.description"
              rows="7"
              placeholder="Enter Description"
              class="bg-darkBackground px-3 py-2.5 rounded-lg w-full text-headingColor text-sm"
            ></textarea>
          </div>

          <!-- Button -->
          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              v-if="isEditMode"
              class="bg-red-600 hover:opacity-90 px-5 py-2.5 rounded-lg text-headingColor transition"
              @click="handleOpenDeleteModal"
            >
              Delete
            </button>
            <button
              type="submit"
              class="bg-darkBackground hover:opacity-90 px-5 py-2.5 rounded-lg text-headingColor transition"
            >
              {{ isEditMode ? "Update" : "Save" }}
            </button>
          </div>
        </form>
      </div>

      <!-- Modules Tab -->
      <div v-else>
        <div class="flex bg-darkBackground text-headingColor">
          <!-- Sidebar -->
          <div class="px-4 w-[22rem]">
            <h2 class="mb-4 font-semibold text-lg"></h2>
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
                    selectedStep?.step_name === step.step_name
                      ? 'ring-2 ring-blue-400'
                      : '',
                  ]"
                >
                  <div class="flex flex-1 items-center gap-3">
                    <Icon
                      name="material-symbols:drag-indicator"
                      class="w-5 h-5 text-headingColor hover:text-blue-400 transition cursor-grab hover:cursor-grabbing drag-handle"
                    />
                    <div class="flex flex-col flex-1">
                      <span>{{ step.step_name }}</span>
                      <span class="text-gray-400 text-sm"
                        >{{ step.modules?.length || 0 }} module{{
                          step.modules?.length !== 1 ? "s" : ""
                        }}</span
                      >
                    </div>
                  </div>
                  <div
                    @click.stop="deleteStep(step, index)"
                    class="flex items-center gap-1 hover:text-red-500 transition cursor-pointer"
                  >
                    <Icon
                      name="material-symbols:delete-outline-rounded"
                      class="w-5 h-5"
                    />
                  </div>
                </div>
              </template>
            </draggable>

            <button
              @click="openNewStepModal"
              class="bg-[#1E1F23] hover:bg-[#25272B] mt-4 py-3 rounded-lg w-full text-white transition-all"
            >
              + New Step
            </button>
          </div>

          <!-- Main Content -->
          <div class="flex-1 bg-darkBackground px-6 pt-4 text-white">
            <!-- Heading -->
            <div
              v-if="selectedStep"
              class="flex justify-between items-center bg-[#1E1F23] mb-6 px-4 py-3 rounded-xl text-headingColor"
            >
              <h1 class="font-bold text-3xl">
                {{ selectedStep.step_name }} Modules
              </h1>
              <div class="flex items-center gap-3">
                <!-- Delete Selected Button -->
                <button
                  v-if="selectedModules.length > 0"
                  @click="deleteSelectedModules"
                  class="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white transition-all"
                >
                  <Icon name="material-symbols:delete-outline-rounded" />
                  Delete ({{ selectedModules.length }})
                </button>

                <button
                  @click="openAddModuleModal"
                  class="flex items-center gap-2 bg-[linear-gradient(90deg,_#00B9FF_0%,_#4E47FF_100%)] hover:opacity-90 px-4 py-2 rounded-lg text-white transition-opacity"
                >
                  <Icon name="material-symbols:add" />
                  Add Module
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="py-12 text-center">
              <p class="text-gray-400">Loading modules...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="!selectedStep" class="py-12 text-center">
              <p class="text-gray-400">Select a step to view modules</p>
            </div>

            <!-- Modules Draggable -->
            <draggable
              v-else-if="
                selectedStep.modules && selectedStep.modules.length > 0
              "
              v-model="selectedStep.modules"
              group="modules"
              item-key="id"
              handle=".drag-handle"
              @end="onModuleDragEnd"
              class="gap-6 grid grid-cols-1 sm:grid-cols-3 w-full"
            >
              <template #item="{ element: module }">
                <div
                  class="group relative flex flex-col bg-darkForground rounded-xl w-[280px] overflow-hidden cursor-pointer"
                  @click="toggleModuleSelection(module.id)"
                >
                  <!-- Checkbox -->
                  <div
                    :class="[
                      'absolute top-3 left-3 z-10 transition-opacity duration-200',
                      isModuleSelected(module.id)
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100',
                    ]"
                  >
                    <div
                      :class="[
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                        isModuleSelected(module.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'bg-[#1E1F23] border-gray-400 hover:border-blue-400',
                      ]"
                    >
                      <Icon
                        v-if="isModuleSelected(module.id)"
                        name="material-symbols:check"
                        class="text-white text-sm"
                      />
                    </div>
                  </div>

                  <img
                    :src="module.image || '/images/courseImage.png'"
                    :alt="module.name"
                    class="w-full h-48 object-cover"
                  />
                  <div
                    class="flex flex-col flex-1 space-y-2 bg-darkForeground p-4 pb-4"
                  >
                    <h3 class="font-bold text-white text-lg">
                      {{ module.name }}
                    </h3>
                    <p class="flex-1 text-gray-300 text-sm">
                      {{ module.description || "No description available" }}
                    </p>
                  </div>

                  <div
                    class="relative flex justify-between items-center bg-[#292D32] px-4 py-2 border-[#303347] border-r-2 border-b-2 border-l-2 rounded-bl-xl rounded-br-xl"
                  >
                    <p class="text-gray-400 italic capitalize">
                      {{ module.status || "Published" }}
                    </p>
                    <Icon
                      name="material-symbols:drag-indicator"
                      class="w-5 h-5 text-headingColor hover:text-blue-400 transition cursor-grab hover:cursor-grabbing drag-handle"
                      @click.stop
                    />
                  </div>
                </div>
              </template>
            </draggable>

            <!-- No modules in step -->
            <div v-else class="py-12 text-center">
              <p class="text-gray-400">No modules in this step</p>
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

    <!-- New Step Modal -->
    <transition name="fade">
      <div
        v-if="showNewStepModal"
        class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
        @click.self="closeNewStepModal"
      >
        <div class="bg-[#1E1F23] p-6 rounded-lg w-96">
          <h2 class="mb-4 font-semibold text-headingColor text-xl">
            Create New Step
          </h2>
          <form @submit.prevent="createNewStep">
            <div class="mb-4">
              <label class="block mb-2 text-headingColor text-sm"
                >Step Name</label
              >
              <input
                v-model="newStepName"
                type="text"
                placeholder="Enter step name"
                class="bg-darkBackground px-3 py-2.5 rounded-lg w-full text-headingColor text-sm"
                required
              />
            </div>
            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="closeNewStepModal"
                class="hover:bg-darkBackground px-4 py-2 rounded-lg text-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-headingColor hover:opacity-90 px-4 py-2 rounded-lg text-darkBackground transition"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Add Module Modal -->
    <transition name="fade">
      <div
        v-if="showAddModuleModal"
        class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
        @click.self="closeAddModuleModal"
      >
        <div class="bg-[#2A2D35] p-8 rounded-lg w-[400px]">
          <h2 class="mb-6 font-medium text-white text-2xl">Add New Model</h2>
          <form @submit.prevent="addModuleToStep">
            <!-- Select Module -->
            <div class="mb-6">
              <label class="block mb-2 text-white text-sm">Select Module</label>
              <select
                v-model="selectedModuleId"
                class="bg-[#1E1F23] px-4 py-3 border border-[#3A3D45] focus:border-headingColor rounded-lg focus:outline-none w-full text-white text-sm"
                required
              >
                <option value="" disabled>Select a module</option>
                <option
                  v-for="module in availableModules"
                  :key="module.id"
                  :value="module.id"
                >
                  {{ module.name }}
                </option>
              </select>
            </div>

            <!-- Order -->
            <div class="mb-6">
              <label class="block mb-2 text-white text-sm">Order</label>
              <input
                v-model.number="moduleOrder"
                type="number"
                min="1"
                placeholder="Enter order"
                class="bg-[#1E1F23] px-4 py-3 border border-[#3A3D45] focus:border-headingColor rounded-lg focus:outline-none w-full text-white text-sm"
                required
              />
            </div>

            <!-- Buttons -->
            <div class="flex justify-center gap-3">
              <button
                type="button"
                @click="closeAddModuleModal"
                class="bg-[#D84A4A] hover:opacity-90 px-6 py-2.5 rounded-lg font-medium text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-[#4A5568] hover:opacity-90 px-6 py-2.5 rounded-lg font-medium text-white transition"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="fade">
      <div
        v-if="showDeleteModal"
        class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
        @click.self="closeDeleteModal"
      >
        <div class="bg-[#2A2D35] p-8 rounded-lg w-[420px]">
          <h2 class="mb-4 font-medium text-white text-2xl">Confirm Deletion</h2>
          <p class="mb-6 text-gray-300">
            <span v-if="deleteModalData.type === 'step'">
              Are you sure you want to delete
              <span class="font-semibold text-white"
                >"{{ deleteModalData.name }}"</span
              >
              step?
              <span
                v-if="deleteModalData.item?.modules?.length > 0"
                class="block mt-2 text-red-400"
              >
                This will also remove
                {{ deleteModalData.item.modules.length }} module(s) from this
                step.
              </span>
            </span>
            <span v-else-if="deleteModalData.type === 'modules'">
              Are you sure you want to delete
              <span class="font-semibold text-white"
                >{{ selectedModules.length }} selected module(s)</span
              >?
              <span class="block mt-2 text-gray-400 text-sm">
                {{ deleteModalData.name }}
              </span>
            </span>
            <span v-else>
              Are you sure you want to delete
              <span class="font-semibold text-white"
                >"{{ deleteModalData.name }}"</span
              >
              module?
            </span>
          </p>
          <div class="flex justify-center gap-3">
            <button
              type="button"
              @click="closeDeleteModal"
              class="bg-[#4A5568] hover:opacity-90 px-6 py-2.5 rounded-lg font-medium text-white transition"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="confirmDelete"
              class="bg-[#D84A4A] hover:opacity-90 px-6 py-2.5 rounded-lg font-medium text-white transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>

    <LazyConfirmModal
    v-show="confirmDeleteVisible"
      v-model:visible="confirmDeleteVisible"
      title="Confirm Delete"
      message="Are you sure you want to delete this learning path?"
      @confirm="handleDeleteConfirmation"
      @close="confirmDeleteVisible = false"
    />
  </div>
</template>

<script setup>
import draggable from "vuedraggable";
const confirmDeleteVisible = ref(false);
const isLoadingDelete = ref(false);

const handleOpenDeleteModal = () => {
  confirmDeleteVisible.value = true;
};

const handleDeleteConfirmation = async () => {
  isLoadingDelete.value = true;
  try {
    await handleDeleteLearningPath();
    confirmDeleteVisible.value = false;
  } catch (error) {
    console.error("Error deleting learning path:", error);
  } finally {
    isLoadingDelete.value = false;
    confirmDeleteVisible.value = false;
  }
};

// Use the composable
const {
  activeTab,
  isEditMode,
  form,
  steps,
  selectedStep,
  loading,
  showNewStepModal,
  newStepName,
  showAddModuleModal,
  availableModules,
  selectedModuleId,
  moduleOrder,
  showDeleteModal,
  deleteModalData,
  selectedModules,
  toast,
  fetchRoadmapData,
  fetchAvailableModules,
  handleSubmit,
  selectStep,
  openNewStepModal,
  closeNewStepModal,
  createNewStep,
  deleteStep,
  onStepDragEnd,
  isModuleSelected,
  toggleModuleSelection,
  openAddModuleModal,
  closeAddModuleModal,
  addModuleToStep,
  deleteModule,
  deleteSelectedModules,
  onModuleDragEnd,
  confirmDelete,
  closeDeleteModal,
  handleTabChange,
  handleDeleteLearningPath,
} = useLearningPath();

// Initialize data on mount
onMounted(() => {
  fetchRoadmapData();
  fetchAvailableModules();
});
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
