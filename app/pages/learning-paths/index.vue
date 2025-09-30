<template>
  <div class="w-full h-full">
    <div class="flex justify-between items-center w-full">
      <h1 class="text-headingColor text-3xl">Learning Paths</h1>
       <NuxtLink 
        to="/modules/create" 
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
      <LazyLearningPathCards v-for="(learningPath, index) in currentLearningPaths" :key="index" :learning-path="learningPath" />
    </div>
  </div>
</template>

<script setup>

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

const currentLearningPaths = ref([
  {
    slug: "system-administrator",
    name: "System Administrator",
    status: "Role",
    icon: "clarity:administrator-line",
    modules: ["id"],
    totalDuration: 45
  },
  {
    slug: "frontend-development",
    name: "Frontend Development",
    status: "Role",
    icon: "mdi:code-braces",
    modules: ["id", "id", "id"],
    totalDuration: 145
  }
]) 
</script>
