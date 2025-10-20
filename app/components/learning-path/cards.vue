 <template>
  <div
    class="bg-darkForeground hover:shadow-lg p-5 rounded-xl transition-all hover:-translate-x-1 hover:-translate-y-1 cursor-pointer"
  >
    <div class="flex justify-between items-center gap-2 w-full">
      <div>
        <span class="text-[#B2BBC6] capitalize">{{ props?.role }}</span>
        <h2 class="font-semibold text-headingColor text-2xl">
          {{ props?.title }}
        </h2>
      </div>
      <div
        class="flex justify-center items-center bg-[#292D32] rounded-md w-16 h-16"
      >
        <Icon name="iconoir:learning" class="w-10 h-12 text-headingColor" />
      </div>
    </div>
    <div class="flex justify-between items-center pt-16">
      <div class="flex items-center gap-2 text-[#B2BBC6] text-sm">
        <p>{{ props?.module_count }} Module</p>
        <p v-if="Number(props?.duration_days) > 0" class="flex items-center gap-1">
          <Icon name="mingcute:time-duration-line" />
          <span>
            {{ props?.duration_days }} Duration Days
          </span>
        </p>
      </div>
      <NuxtLink :to="'/learning-paths/' + props?.slug">
        <Icon
          name="material-symbols:arrow-right-alt"
          class="w-6 h-6 text-[#B2BBC6]"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: "hello",
  },
  role: {
    type: String,
    required: true,
    default: "Role",
  },
  module_count: {
    type: Number,
    required: true,
    default: 0,
  },

  duration_days: {
    type: Number,
    required: true,
    default: 0,
  },

  slug: {
    type: String,
    required: true,
    default: "slug",
  },
});
</script>
