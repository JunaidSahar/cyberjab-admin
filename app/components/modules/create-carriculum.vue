<template>
  <div class="flex gap-6 pt-6 w-full">
    <!-- Curriculum List -->
    <div class="space-y-2 w-[25%]">
      <div
        v-if="loading"
        class="flex justify-center items-center gap-2 min-h-72 text-headingColor/50 text-center"
      >
        <Icon name="svg-spinners:180-ring-with-bg" class="w-5 h-5 animate-spin" />
        Loading...
      </div>
      <div v-else-if="!lessons.length">
        <div
          class="flex flex-col justify-center items-center gap-2 bg-darkForeground rounded-xl min-h-72 text-headingColor/50 text-center"
        >
          <Icon
            name="material-symbols-light:nfc-off-outline-rounded"
            class="w-16 h-16 text-headingColor/30"
          />
          <p class="text-headingColor/50 text-sm">
            No lessons available. Add a new lesson to get started.
          </p>
        </div>
      </div>
      <draggable
        v-else-if="!loading"
        v-model="lessons"
        group="lessons"
        item-key="id"
        handle=".drag-handle"
        @end="onDragEnd"
        class="space-y-2"
      >
        <template #item="{ element: item, index }">
          <div
            class="flex justify-between items-center bg-darkForeground px-3 py-2 rounded-lg transition-all cursor-pointer"
            @click="selectCarriculum(item, index)"
            :class="selectedCarriculumIndex === index ? 'ring-2 ring-blue-500' : ''"
          >
            <div class="flex items-center gap-3">
              <Icon
                name="material-symbols:drag-indicator"
                class="w-5 h-5 text-headingColor cursor-grab hover:cursor-grabbing drag-handle"
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
        </template>
      </draggable>

      <div
        class="flex justify-center items-center gap-2 bg-darkForeground hover:bg-darkForeground/80 px-4 py-2 rounded-lg min-h-10 text-white transition-colors cursor-pointer"
        @click="addNewLesson"
      >
        <Icon name="material-symbols:add" />
        New lesson
      </div>
    </div>

    <!-- Lesson Editor -->
    <div class="bg-darkForeground p-6 rounded-xl w-[75%]">
      <div class="flex justify-between items-center pb-5">
        <h3 class="text-headingColor text-2xl">Lesson Information</h3>
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
      <form v-else @submit.prevent="saveLessonChanges" class="gap-5 grid grid-cols-2">
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

        <div class="flex flex-col gap-2 col-span-1">
          <label for="contentType" class="text-headingColor">Content Type</label>
          <select
            id="contentType"
            v-model="selectedCarriculum.content_type"
            type="text"
            placeholder="html, markdown"
            class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-headingColor text-sm"
          >
            <option value="html">HTML</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>

        <!-- Lab Toggle -->
        <div class="flex flex-col gap-2 col-span-1">
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

          <div v-if="selectedCarriculum.content_type !== 'markdown'">
            <ClientOnly>
              <TiptapEditor
                v-model="selectedCarriculum.content"
                :placeholder="'Enter lesson content...'"
              />
            </ClientOnly>
          </div>
          <div v-if="selectedCarriculum.content_type === 'markdown'">
            <ul
              class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
            >
              <li
                class="inline-block p-4 rounded-t-lg hover:bg-gray-800 hover:text-gray-300"
                :class="previewMarkdown && 'bg-gray-800 text-blue-500'"
                @click="previewMarkdown = true"
              >
                Preview
              </li>
              <li
                class="inline-block p-4 rounded-t-lg hover:bg-gray-800 hover:text-gray-300"
                :class="!previewMarkdown && 'bg-gray-800 text-blue-500'"
                @click="previewMarkdown = false"
              >
                Edit
              </li>
            </ul>
            <div
              class="prose prose-invert"
              v-if="previewMarkdown"
              v-html="marked(selectedCarriculum.content)"
            ></div>
            <div v-else>
              <textarea
                v-model="selectedCarriculum.content"
                rows="30"
                class="w-full bg-darkBackground text-headingColor p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono placeholder:opacity-30"
                placeholder="Enter markdown content here..."
              ></textarea>
            </div>
          </div>
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
            :disabled="lessonLoading || !selectedCarriculum.name?.trim()"
            class="bg-[linear-gradient(90deg,_#00B9FF_0%,_#4E47FF_100%)] disabled:opacity-50 px-5 py-2.5 rounded-lg text-white transition-opacity"
          >
            {{ lessonLoading ? "Creating..." : "Save Lesson" }}
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
      @confirm="deleteCarriculum"
      @close="confirmDeleteVisible = false"
    />
  </div>
</template>

<script setup>
import draggable from "vuedraggable";
import TiptapEditor from "../global/tiptap-editor.vue";
import { marked } from "marked";

const { getLessons, createLesson, updateLesson, deleteLesson } = useLesson();

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  moduleId: {
    type: String,
    default: null,
  },
  moduleSlug: {
    type: String,
    default: null,
  },
});

// Emits
const emit = defineEmits([
  "lesson-saved",
  "lesson-deleted",
  "lesson-added",
  "lessons-reordered",
]);

// Reactive data
const lessons = ref([]);
const selectedCarriculum = ref({});
const selectedCarriculumIndex = ref(null);
const confirmDeleteVisible = ref(false);
const lessonLoading = ref(false);
const loading = ref(false);
const deleteIndex = ref(null);
const isCreatingLesson = ref(false);
const previewMarkdown = ref(false);

// Fetch lessons from API
const fetchLessons = async () => {
  if (!props.moduleSlug) {
    console.warn("Module slug is required to fetch lessons");
    return;
  }

  loading.value = true;
  try {
    const data = await getLessons(1, 100, props.moduleSlug); // Get all lessons
    if (data && data.data) {
      lessons.value = data.data || [];
    } else if (data && data.error) {
      console.error("Error fetching lessons:", data.error);
    }
  } catch (error) {
    console.error("Error fetching lessons:", error);
  } finally {
    loading.value = false;
  }
};

// Initialize on mount
onMounted(() => {
  fetchLessons();
});

// Watch for moduleSlug changes
watch(
  () => props.moduleSlug,
  (newSlug) => {
    if (newSlug) {
      fetchLessons();
    }
  }
);

// Utility Functions
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const generateTempId = () => {
  return `temp_${Date.now()}_${Math.random()}`;
};

// Curriculum Management Functions
const selectCarriculum = (item, index) => {
  selectedCarriculum.value = { ...item };
  selectedCarriculumIndex.value = index;
};

const addNewLesson = () => {
  const newLesson = {
    id: generateTempId(), // Temporary ID for new lessons
    name: "",
    duration: "",
    slug: "",
    has_lab: false,
    content: "<p>Enter your lesson content here...</p>",
    order: lessons.value.length + 1,
    is_new: true, // Flag to identify new lessons
  };

  lessons.value.push(newLesson);
  const newIndex = lessons.value.length - 1;
  selectCarriculum(newLesson, newIndex);

  // Emit event for parent to handle
  emit("lesson-added", newLesson);
};

const openDeleteModal = (index) => {
  deleteIndex.value = index;
  confirmDeleteVisible.value = true;
};

const deleteCarriculum = async () => {
  const index = deleteIndex.value;
  if (index === null) return;

  const lessonToDelete = lessons.value[index];

  try {
    // Check if it's a newly added lesson that hasn't been saved to server
    if (lessonToDelete.is_new) {
      // Handle local deletion for new lessons
      console.log("Deleting newly added lesson locally:", lessonToDelete);

      // Remove from local array immediately
      lessons.value.splice(index, 1);

      // Reset selection if deleted item was selected
      if (selectedCarriculumIndex.value === index) {
        selectedCarriculum.value = {};
        selectedCarriculumIndex.value = null;
      } else if (selectedCarriculumIndex.value > index) {
        selectedCarriculumIndex.value--;
      }

      // Emit event for parent to handle local cleanup
      emit("lesson-deleted", lessonToDelete);
    } else {
      // Handle API deletion for existing lessons
      const deleteResponse = await deleteLesson(lessonToDelete.slug);
      if (deleteResponse.error) {
        throw new Error(deleteResponse.error);
      }

      emit("lesson-deleted", lessonToDelete);

      // Remove from local array
      lessons.value.splice(index, 1);

      // Reset selection if deleted item was selected
      if (selectedCarriculumIndex.value === index) {
        selectedCarriculum.value = {};
        selectedCarriculumIndex.value = null;
      } else if (selectedCarriculumIndex.value > index) {
        selectedCarriculumIndex.value--;
      }

      console.log("Lesson deleted from server:", lessonToDelete);
    }
  } catch (error) {
    console.error("Error deleting lesson:", error);
    alert("Failed to delete lesson. Please try again.");
  } finally {
    confirmDeleteVisible.value = false;
    deleteIndex.value = null;
  }
};

const saveLessonChanges = async () => {
  if (selectedCarriculumIndex.value === null || !selectedCarriculum.value.name?.trim()) {
    return;
  }

  lessonLoading.value = true;

  try {
    // Auto-generate slug if empty
    if (!selectedCarriculum.value.slug && selectedCarriculum.value.name) {
      selectedCarriculum.value.slug = generateSlug(selectedCarriculum.value.name);
    }

    // Update the lesson in the array
    lessons.value[selectedCarriculumIndex.value] = {
      ...selectedCarriculum.value,
    };

    // Emit save event for parent to handle API call
    if (selectedCarriculum.value.is_new) {
      await createLesson({
        slug: selectedCarriculum.value.slug,
        module: props.moduleId,
        name: selectedCarriculum.value.name,
        duration: selectedCarriculum.value.duration,
        has_lab: selectedCarriculum.value.has_lab,
        content: selectedCarriculum.value.content,
        content_type: selectedCarriculum.value.content_type || "html",
        order: selectedCarriculum.value.order,
      });
    } else {
      await updateLesson(selectedCarriculum.value.slug, {
        name: selectedCarriculum.value.name,
        duration: selectedCarriculum.value.duration,
        has_lab: selectedCarriculum.value.has_lab,
        content: selectedCarriculum.value.content,
        order: selectedCarriculum.value.order,
        module: props.moduleId,
        content_type: selectedCarriculum.value.content_type || "html",
        slug: props.value.slug,
      });
    }

    // Emit save event for parent to handle API call
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
    // If it's a new lesson that hasn't been saved, remove it
    if (lessons.value[selectedCarriculumIndex.value]?.is_new) {
      lessons.value.splice(selectedCarriculumIndex.value, 1);
      selectedCarriculum.value = {};
      selectedCarriculumIndex.value = null;
    } else {
      // Restore original values for existing lessons
      const originalLesson = lessons.value[selectedCarriculumIndex.value];
      selectedCarriculum.value = { ...originalLesson };
    }
  }
};

// Auto-generate slug when name changes
watch(
  () => selectedCarriculum.value.name,
  (newName) => {
    if (newName && !selectedCarriculum.value.slug) {
      selectedCarriculum.value.slug = generateSlug(newName);
    }
  }
);

// Expose methods for parent component
defineExpose({
  addNewLesson,
  saveLessonChanges,
  fetchLessons,
  lessons: readonly(lessons),
});

// Drag and Drop Functions
const onDragEnd = async (event) => {
  const { oldIndex, newIndex } = event;

  if (oldIndex === newIndex) return;

  // Update the order property for all lessons
  lessons.value.forEach((lesson, index) => {
    lesson.order = index + 1;
  });

  // Emit the reordered lessons to parent
  emit("lessons-reordered", lessons.value);

  // If you have an API endpoint to update lesson order, call it here
  await updateLessonOrder();
};

const updateLessonOrder = async () => {
  try {
    // Create an array of lesson IDs in their new order
    const orderedLessons = lessons.value.map((lesson, index) => ({
      id: lesson.id,
      order: index + 1,
    }));

    // If you have an API endpoint for bulk order update, use it here
    // For now, we'll update each lesson individually
    for (const lesson of lessons.value) {
      if (!lesson.is_new && lesson.id) {
        // Only update existing lessons (not new ones)
        const { error } = await updateLesson(lesson.slug, {
          ...lesson,
          order: lesson.order,
        });

        if (error) {
          console.error("Error updating lesson order:", error);
        }
      }
    }

    console.log("Lesson order updated successfully");
  } catch (error) {
    console.error("Error updating lesson order:", error);
  }
};
</script>

<style scoped>
.drag-handle:hover {
  color: #0800f7;
}

.sortable-ghost {
  opacity: 0.5;
  background: #1e1f23;
  border: 2px dashed #0800f7;
}

.sortable-chosen {
  transform: rotate(5deg);
}

.sortable-drag {
  transform: rotate(5deg);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}
</style>
