<template>
  <div
    class="flex flex-col justify-between bg-darkForeground p-6 border border-border rounded-lg w-full max-w-lg min-h-60"
  >
    <div class="flex items-center gap-3">
      <div
        class="flex justify-center items-center bg-[#292D32] rounded-full w-14 h-14 text-headingColor"
      >
        <Icon class="w-8 h-8" :name="props.cardData.icon" />
      </div>
      <h3 class="font-bold text-headingColor text-2xl">
        {{ props.cardData.title }}
      </h3>
    </div>
    <div class="flex justify-between items-end mt-4">
      <div>
        <p
          class="font-medium text-sm"
          :class="{
            'text-green-500': props.cardData.percentageChange > 0,
            'text-red-500': props.cardData.percentageChange < 0,
          }"
        >
          {{ props.cardData.percentageChange }} %
        </p>
        <p class="text-headingColor text-sm">{{ props.cardData.sumary }}</p>
      </div>
      <p class="text-headingColor text-3xl">${{ props.cardData.totalCost }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  cardData: {
    type: Object,
    required: false,
    default: () => ({
      icon: "dollar-sign",
      title: "Total Revenue",
      percentageChange: "+2.65%",
      totalCost: "26,256.00",
    }),
  },
});
</script>
