<template>
  <div
    class="bg-darkForground p-6 border border-border rounded-lg w-full"
  >
    <div class="pb-5 text-headingColor">
      <h3 class="font-bold text-2xl">Top Performance</h3>
      <p class="text-sm">Students labs performance based on score</p>
    </div>
    <div class="relative flex flex-col gap-4 pt-6">
      <div
        v-for="(p, index) in performances"
        :key="index"
        class="flex items-center gap-2"
      >
        <div class="px-3 w-fit text-[#7F829A]">
          {{ p.position }}
        </div>
        <div
          :style="{
            width: p.progress,
            background: p.color,
          }"
          class="relative py-2 rounded-tr-lg rounded-br-lg font-semibold text-headingColor text-sm text-center"
        >
          <p>{{ p.name }}</p>
        </div>
      </div>
      <div
        class="flex justify-between mt-1 pl-10 w-full h-full text-[#7F829A] text-sm"
      >
        <div v-for="(item, index) in performances.reverse()" :key="index">
          {{ item.score }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const performances = [
  {
    position: 1,
    name: "Shaheer Haider",
    color: "#3776AB",
    progress: "100%",
    score: "4K",
  },
  {
    position: 2,
    name: "Junaid Ahmed",
    color: "#D49F00",
    progress: "75%",
    score: "3K",
  },
  {
    position: 3,
    name: "Rasikh Ikram",
    color: "#0078D4",
    progress: "50%",
    score: "2K",
  },
  {
    position: 4,
    name: "Usama Khan",
    color: "#6A0DAD",
    progress: "35%",
    score: "1K",
  },
  {
    position: 5,
    name: "Jahanzaib",
    color: "#D83B01",
    progress: "20%",
    score: "0",
  },
];
</script>
