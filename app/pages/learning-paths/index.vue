<template>
  <div class="w-full h-full">
    <div class="flex justify-between items-center w-full">
      <h1 class="text-headingColor text-3xl">Learning Paths</h1>
      <NuxtLink
        to="/learning-paths/create"
        class="flex items-center gap-2 bg-[linear-gradient(90deg,_#00B9FF_0%,_#4E47FF_100%)] hover:opacity-90 px-4 py-2 rounded-lg text-white transition-opacity"
      >
        <Icon name="material-symbols:add" />
        Create
      </NuxtLink>
    </div>
    <div class="space-x-12 pt-4 border-b border-border">
      <button
        @click="activeButton = button.id"
        :class="
          button.id == activeButton
            ? 'border-headingColor'
            : 'border-transparent'
        "
        class="pb-3 border-b-2 font-medium text-headingColor transition-all"
        v-for="(button, index) in tabs"
        :key="index"
      >
        {{ button.name }}
      </button>
    </div>

    <div class="items-center gap-6 grid grid-cols-3 pt-5">
      <template v-for="index in 3" :key="index" v-if="isLoading" >
        <CardSkeleton />
      </template>
      <LazyLearningPathCards
        v-else-if="currentLearningPaths.length > 0"
        v-for="(learningPath, index) in currentLearningPaths"
        :key="learningPath.id"
        :title="learningPath?.name"
        :role="learningPath?.type"
        :module_count="learningPath?.module_count"
        :duration_days="learningPath?.duration_days"
        :slug="learningPath?.slug"
      />

      <div v-else>
        <p class="text-headingColor text-2xl text-center">
          No Learning Paths Found
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLearningPath } from "@/composables/useLearningPaths";
import CardSkeleton from "~/components/learning-path/card-skeleton.vue";
const isLoading = ref(false);
const router = useRouter();

const { getLearningPaths } = useLearningPath();

onMounted(async () => {
  isLoading.value = true;
  const { data, error } = await getLearningPaths();
  if (data) {
    currentLearningPaths.value = data.results;
    isLoading.value = false;
  }
});

const activeButton = ref("all");
const tabs = ref([
  {
    name: "Published",
    id: "published",
    active: true,
  },
  {
    name: "Unpublished",
    id: "unpublished",
    active: false,
  },
  {
    name: "All",
    id: "all",
    active: false,
  },
]);

const currentLearningPaths = ref([]);
</script>
