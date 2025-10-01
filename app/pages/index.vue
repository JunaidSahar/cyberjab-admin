<template>
  <div>
    <h1 class="text-headingColor text-3xl capitalize">Welcome, {{userStore.user?.first_name}} 👋</h1>
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
        <h3 class="text-headingColor text-2xl pb-2">Recently published modules</h3>
        <ClientOnly>
            <div v-if="modulesLoading" class="flex items-center gap-4">
                <div v-for="i in 4" :key="i" class="animate-pulse bg-gray-200 rounded-lg max-w-sm min-h-60"></div>
            </div>
            <div v-else-if="modulesError" class="text-red-500 p-4">
                Error loading modules: {{ modulesError }}
            </div>
            <div v-else-if="recentModules && recentModules.length > 0" class="flex items-center gap-4 overflow-x-auto">
                <ModuleCard v-for="module in recentModules?.slice(0, 4)" :key="module.id" :module="module" />
            </div>
            <div v-else class="text-gray-500 p-4">
                No modules found. <NuxtLink to="/modules" class="text-blue-500 hover:underline">Create your first module</NuxtLink>
            </div>
            <template #fallback>
                <div class="flex items-center gap-4">
                    <div v-for="i in 4" :key="i" class="animate-pulse bg-gray-200 rounded-lg max-w-sm min-h-60"></div>
                </div>
            </template>
        </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import ModuleCard from '~/components/modules/card.vue'

const userStore = useUserStore()
const { getRecentModules } = useModules()

// Recent modules state
const recentModules = ref([])
const modulesLoading = ref(true)
const modulesError = ref(null)

// Fetch recent modules on mount
onMounted(async () => {
  const { data, error } = await getRecentModules()
  
  if (error) {
    modulesError.value = error
  } else {
    recentModules.value = data?.results || []
  }
  
  modulesLoading.value = false
})

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
