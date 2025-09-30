<template>
  <div class="bg-darkForground hover:shadow-lg p-5 rounded-xl transition-all hover:-translate-x-1 hover:-translate-y-1 cursor-pointer">
    <div class="flex justify-between items-center gap-2 w-full">
      <div>
        <span class="text-[#B2BBC6]">Role</span>
        <h2 class="font-semibold text-headingColor text-2xl">
          {{ props.learningPath?.name }}
        </h2>
      </div>
      <div
        class="flex justify-center items-center bg-[#292D32] rounded-md w-16 h-16"
      >
        <Icon
          :name="props.learningPath?.icon"
          class="w-10 h-12 text-headingColor"
        />
      </div>
    </div>
    <div class="flex justify-between items-center pt-16">
      <div class="flex items-center gap-2 text-[#B2BBC6] text-sm">
        <p>{{ props.learningPath?.modules?.length }} Module</p>
        <p class="flex items-center gap-1">
            <Icon name="mingcute:time-duration-line" />
            {{ props.learningPath?.totalDuration }} Duration</p>
      </div>
      <Icon
        name="material-symbols:arrow-right-alt"
        class="w-6 h-6 text-[#B2BBC6]"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  learningPath: {
    type: Object,
    default: null,
  },
});
</script>
