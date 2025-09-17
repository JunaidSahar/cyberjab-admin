<template>
  <div class="flex flex-col">
    <div class="-m-1.5 overflow-x-auto">
      <div class="inline-block p-1.5 min-w-full align-middle">
        <div
          v-if="selectedRows.length"
          class="flex justify-end gap-2 mb-6 w-full"
        >
          <button
            type="button"
            class="flex justify-center items-center bg-red-600 rounded-xl w-10 h-10 text-white"
            :disabled="selectedRows.length === 0"
            @click="emitSelectedAction"
          >
            <Icon
              name="material-symbols:delete-outline-rounded"
              class="w-5 h-5"
            />
          </button>
          <button
            type="button"
            class="flex justify-center items-center gap-1 bg-darkForground px-5 rounded-xl w-auto h-10 text-white text-sm"
            :disabled="selectedRows.length === 0"
            @click="emitSelectedAction"
          >
            <Icon
              name="material-symbols:arrow-upload-progress"
              class="w-5 h-5"
            />
            Active
          </button>
        </div>
        <div class="overflow-hidden">
          <table class="min-w-full">
            <thead>
              <tr class="bg-[#292D32] text-headingColor">
                <th class="px-4 py-3 text-start">
                  <input
                    type="checkbox"
                    :checked="allSelected"
                    @change="toggleSelectAll"
                  />
                </th>
                <th
                  v-for="col in columns"
                  :key="col.key"
                  :class="[
                    'px-6 py-3 font-medium text-sm',
                    col.align === 'end' ? 'text-end' : 'text-start',
                  ]"
                  scope="col"
                >
                  {{ col.title }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowIdx) in data"
                :key="rowIdx"
                class="bg-darkForground text-headingColor"
              >
                <td class="px-4 py-4">
                  <input
                    type="checkbox"
                    :value="rowIdx"
                    v-model="selectedRows"
                  />
                </td>
                <td
                  v-for="col in columns"
                  :key="col.key"
                  :class="[
                    'px-6 py-4 text-sm whitespace-nowrap',
                    col.align === 'end'
                      ? 'text-end font-medium'
                      : 'font-medium',
                  ]"
                >
                  <template v-if="col.key === 'action'">
                    <button
                      type="button"
                      class="inline-flex items-center gap-x-2 disabled:opacity-50 border border-transparent rounded-lg focus:outline-hidden font-semibold text-white hover:text-white/80 focus:text-blue-800 dark:hover:text-blue-400 dark:focus:text-blue-400 dark:text-blue-500 text-sm disabled:pointer-events-none"
                      @click="$emit('action', row)"
                    >
                      <Icon name="humbleicons:dots-vertical" class="w-5 h-5" />
                    </button>
                  </template>
                  <template v-else-if="col.key === 'status'">
                    <div
                      :class="`px-3 py-1 text-sm w-fit text-darkBackground rounded-full ${
                        row.status === 'Active' || row.status == 'Paid'
                          ? 'bg-green-400'
                          : 'bg-yellow-400'
                      }`"
                    >
                      {{ row[col.key] }}
                    </div>
                  </template>
                  <template v-else>
                    {{ row[col.key] }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  columns: {
    type: Array,
    default: () => [
      { key: "name", title: "Name" },
      { key: "age", title: "Age" },
      { key: "address", title: "Address" },
      { key: "action", title: "Action", align: "end" },
    ],
  },
  data: {
    type: Array,
    default: () => [
      {
        name: "John Brown",
        age: 45,
        address: "New York No. 1 Lake Park",
      },
    ],
  },
});

const selectedRows = ref([]);

const allSelected = computed(
  () => selectedRows.value.length === props.data.length && props.data.length > 0
);

function toggleSelectAll(e) {
  if (e.target.checked) {
    selectedRows.value = props.data.map((_, idx) => idx);
  } else {
    selectedRows.value = [];
  }
}

function emitSelectedAction() {
  // Emit the selected rows' data
  const selectedData = selectedRows.value.map((idx) => props.data[idx]);
  // You can change 'selected-action' to any event name you want
  // Listen to this event in parent: @selected-action="yourHandler"
  // Or replace with your logic here
  // Example: $emit('selected-action', selectedData)
  // For <script setup>, use defineEmits:
  emit("selected-action", selectedData);
}

const emit = defineEmits(["selected-action"]);
</script>
