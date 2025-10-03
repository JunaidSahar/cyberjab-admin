<template>
  <div class="w-full h-full">
    <div class="flex justify-between items-center w-full">
      <h1 class="text-headingColor text-3xl">
        {{ mode === "create" ? "Create" : "Update" }} Learning Path
      </h1>
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-2 bg-red-700 hover:opacity-90 px-4 py-2 rounded-lg text-white text-sm transition-opacity"
        >
          <Icon name="material-symbols:delete-outline" />
          Delete
        </button>
        <button
          class="flex items-center gap-2 bg-[#292D32] hover:opacity-90 px-4 py-2 rounded-lg text-white text-sm transition-opacity"
        >
          <Icon name="material-symbols:arrow-upload-progress" />
          Publish
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const slug = ref(route.params.slug);
const mode = slug.value === "create" ? "create" : "update";

onMounted(() => {
  console.log(slug.value);
});
</script>
