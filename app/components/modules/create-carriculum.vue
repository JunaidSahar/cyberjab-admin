<template>
  <div class="flex gap-6 pt-6 w-full">
    <!-- Curriculum List -->
    <div class="space-y-2 w-[25%]">
      <div
        class="flex justify-between items-center bg-darkForground px-3 py-2 rounded-lg transition-all cursor-pointer"
        v-for="(item, index) in carriculums"
        :key="index"
        @click="selectCarriculum(item, index)"
        :class="selectedCarriculumIndex === index ? 'ring-2 ring-blue-500' : ''"
      >
        <div class="flex items-center gap-3">
          <Icon
            name="material-symbols:drag-indicator"
            class="w-5 h-5 text-headingColor cursor-grab"
          />
          <div class="flex items-center gap-5">
            <div class="space-y-1">
              <p class="font-semibold text-headingColor text-sm">
                {{ item.name || "Untitled Lesson" }}
              </p>
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1 text-headingColor text-xs">
                  <Icon name="mingcute:time-duration-line" />
                  <span>{{ item.duration || "0m" }}</span>
                </div>
                <div
                  v-if="item.has_lab"
                  class="flex items-center gap-1 text-headingColor text-xs"
                >
                  <Icon name="hugeicons:test-tube-01" />
                  <span>Lab</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Icon
          name="material-symbols:delete-outline"
          class="w-5 h-5 text-headingColor hover:text-red-400 transition-colors cursor-pointer"
          @click.stop="() => openDeleteModal(index)"
        />
      </div>

      <div
        class="flex justify-center items-center gap-2 bg-darkForground hover:bg-darkForground/80 px-4 py-2 rounded-lg min-h-10 text-white transition-colors cursor-pointer"
        @click="addNewLesson"
      >
        <Icon name="material-symbols:add" />
        New lesson
      </div>
    </div>

    <!-- Lesson Editor -->
    <div class="bg-darkForground p-6 rounded-xl w-[75%]">
      <div class="flex justify-between items-center pb-5">
        <h3 class="text-headingColor text-2xl">Lesson Information</h3>
        <button
          v-if="selectedCarriculumIndex !== null"
          @click="saveLessonChanges"
          :disabled="lessonLoading"
          class="bg-[linear-gradient(90deg,_#00B9FF_0%,_#4E47FF_100%)] disabled:opacity-50 px-4 py-2 rounded-lg text-white text-sm transition-opacity"
        >
          {{ lessonLoading ? "Saving..." : "Save Changes" }}
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="selectedCarriculumIndex === null"
        class="flex flex-col justify-center items-center py-20 text-center"
      >
        <Icon
          name="material-symbols:book-outline"
          class="mb-4 w-16 h-16 text-headingColor/30"
        />
        <p class="text-headingColor/50 text-lg">
          Select a lesson to edit or create a new one
        </p>
      </div>

      <!-- Lesson Form -->
      <form
        v-else
        @submit.prevent="saveLessonChanges"
        class="gap-5 grid grid-cols-2"
      >
        <!-- Title -->
        <div class="flex flex-col gap-2 col-span-2">
          <label for="lessonTitle" class="text-headingColor">
            Title <span class="text-red-400">*</span>
          </label>
          <input
            id="lessonTitle"
            v-model="selectedCarriculum.name"
            type="text"
            placeholder="Enter lesson title"
            class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-headingColor text-sm"
            required
          />
        </div>

        <!-- Slug -->
        <div class="flex flex-col gap-2 col-span-1">
          <label for="lessonSlug" class="text-headingColor">Slug</label>
          <input
            id="lessonSlug"
            v-model="selectedCarriculum.slug"
            type="text"
            placeholder="Auto-generated from title"
            class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-headingColor text-sm"
          />
        </div>

        <!-- Duration -->
        <div class="flex flex-col gap-2 col-span-1">
          <label for="lessonDuration" class="text-headingColor">Duration</label>
          <input
            id="lessonDuration"
            v-model="selectedCarriculum.duration"
            type="text"
            placeholder="e.g., 10m, 1h 30m"
            class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-headingColor text-sm"
          />
        </div>

        <!-- Lab Toggle -->
        <div class="flex flex-col gap-2 col-span-2">
          <label class="text-headingColor">Lab</label>
          <div class="flex items-center space-x-2 min-h-10">
            <input
              id="lessonLab"
              v-model="selectedCarriculum.has_lab"
              type="checkbox"
              class="bg-gray-100 border-gray-300 rounded focus:ring-blue-500 w-4 h-4 text-blue-600"
            />
            <label for="lessonLab" class="text-headingColor text-sm">
              Is lab available?
            </label>
          </div>
        </div>

        <!-- Content Editor -->
        <div class="flex flex-col gap-2 col-span-2">
          <label for="lessonContent" class="text-headingColor">Content</label>
          <ClientOnly>
            <TiptapEditor
              v-model="selectedCarriculum.content"
              :initial-content="selectedCarriculum.content"
              :placeholder="'Enter lesson content...'"
            />
          </ClientOnly>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 col-span-2 pt-3">
          <button
            type="button"
            @click="cancelLessonEdit"
            class="bg-[#292D32] hover:bg-[#3a3f44] px-5 py-2.5 rounded-lg text-headingColor transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="lessonLoading || !selectedCarriculum.title?.trim()"
            class="bg-[linear-gradient(90deg,_#00B9FF_0%,_#4E47FF_100%)] disabled:opacity-50 px-5 py-2.5 rounded-lg text-white transition-opacity"
          >
            {{ lessonLoading ? "Saving..." : "Save Lesson" }}
          </button>
        </div>
      </form>
    </div>
    <!-- Confirm Modal -->
    <ConfirmModal
      v-show="confirmDeleteVisible"
      v-model:visible="confirmDeleteVisible"
      title="Confirm Delete"
      message="Are you sure you want to delete this lesson?"
      @confirm="deleteCarriculum()"
      @close="confirmDeleteVisible = false"
    />
  </div>
</template>

<script setup>
import TiptapEditor from "../global/tiptap-editor.vue";
import ConfirmModal from "../global/confirm-modal.vue";

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  moduleId: {
    type: [String, Number],
    default: null,
  },
});

// Emits
const emit = defineEmits([
  "update:modelValue",
  "lesson-saved",
  "lesson-deleted",
]);

// Reactive data
const selectedCarriculum = ref({});
const selectedCarriculumIndex = ref(null);
const confirmDeleteVisible = ref(false);
const lessonLoading = ref(false);

// Initialize curriculum data
const carriculums = ref(
  props.modelValue.length > 0 ? [...props.modelValue] : []
);

const openDeleteModal = (index) => {
  confirmDeleteVisible.value = true
  selectedCarriculumIndex.value = index
}

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue.length > 0) {
      carriculums.value = [...newValue];
    }
  },
  { deep: true }
);

// Emit changes to parent
watch(
  carriculums,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);

// Utility Functions
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const generateId = () => {
  return Date.now() + Math.random();
};

// Curriculum Management Functions
const selectCarriculum = (item, index) => {
  selectedCarriculum.value = { ...item };
  selectedCarriculumIndex.value = index;
};

const addNewLesson = () => {
  const newLesson = {
    id: generateId(),
    title: "",
    duration: "",
    slug: "",
    lab: false,
    content: "<p>Enter your lesson content here...</p>",
    order: carriculums.value.length + 1,
  };

  carriculums.value.push(newLesson);
  const newIndex = carriculums.value.length - 1;
  selectCarriculum(newLesson, newIndex);
};

const deleteCarriculum = async (index) => {
  const lessonToDelete = selectedCarriculumIndex;

  try {
    // Emit deletion event for parent to handle API call if needed
    emit("lesson-deleted", lessonToDelete);

    // Remove from local array
    carriculums.value.splice(index, 1);

    // Update order for remaining lessons
    carriculums.value.forEach((lesson, idx) => {
      lesson.order = idx + 1;
    });

    // Reset selection if deleted item was selected
    if (selectedCarriculumIndex.value === index) {
      selectedCarriculum.value = {};
      selectedCarriculumIndex.value = null;
    } else if (selectedCarriculumIndex.value > index) {
      selectedCarriculumIndex.value--;
    }
  } catch (error) {
    console.error("Error deleting lesson:", error);
    alert("Failed to delete lesson. Please try again.");
  } finally {
    confirmDeleteVisible.value = false
  }
};

const saveLessonChanges = async () => {
  if (
    selectedCarriculumIndex.value === null ||
    !selectedCarriculum.value.title?.trim()
  ) {
    return;
  }

  lessonLoading.value = true;

  try {
    // Auto-generate slug if empty
    if (!selectedCarriculum.value.slug && selectedCarriculum.value.title) {
      selectedCarriculum.value.slug = generateSlug(
        selectedCarriculum.value.title
      );
    }

    // Update the lesson in the array
    carriculums.value[selectedCarriculumIndex.value] = {
      ...selectedCarriculum.value,
    };

    // Emit save event for parent to handle API call if needed
    emit("lesson-saved", selectedCarriculum.value);

    console.log("Lesson saved:", selectedCarriculum.value);
  } catch (error) {
    console.error("Error saving lesson:", error);
    alert("Failed to save lesson. Please try again.");
  } finally {
    lessonLoading.value = false;
  }
};

const cancelLessonEdit = () => {
  if (selectedCarriculumIndex.value !== null) {
    // Restore original values
    selectedCarriculum.value = {
      ...carriculums.value[selectedCarriculumIndex.value],
    };
  }
};

// Auto-generate slug when title changes
watch(
  () => selectedCarriculum.value.title,
  (newTitle) => {
    if (newTitle && !selectedCarriculum.value.slug) {
      selectedCarriculum.value.slug = generateSlug(newTitle);
    }
  }
);

// Expose methods for parent component
defineExpose({
  addNewLesson,
  saveLessonChanges,
  carriculums: readonly(carriculums),
});
</script>
