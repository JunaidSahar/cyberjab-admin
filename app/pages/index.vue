<template>
  <div>
    <h1 class="text-headingColor text-3xl">Welcome, M Shaheer 👋</h1>
    <div class="gap-4 grid grid-cols-3 py-6">
      <DashboardStatesCard
        v-for="(data, index) in dashboardStatesCard"
        :key="index"
        :card-data="data"
      />
    </div>
    <div class="gap-4 grid grid-cols-2">
        <ClientOnly>

            <Chart />
        </ClientOnly>
        <DashboardTopPerformance />
    </div>

    <div class="pt-6">
        <h3 class="text-headingColor text-2xl">Recently created modules</h3>
        <div class="flex items-center gap-4">

            <DashboardModuleCard v-for="(item, index) in 4" :key="index" />
        </div>
    </div>
  </div>
</template>

<script setup>
const dashboardStatesCard = [
  {
    icon: "bx:dollar",
    title: "Azure Cost",
    percentageChange: +40.65,
    totalCost: "26,256.00",
    sumary: "average per student",
  },
  {
    icon: "lucide:user-round",
    title: "Paid Users",
    percentageChange: +2.65,
    totalCost: "2,256",
    sumary: "From previous 30 days",
  },
  {
    icon: "mdi:magnet-on",
    title: "Leads",
    percentageChange: -2.65,
    totalCost: "1,256",
    sumary: "From previous 30 days",
  },
];
</script>
