<template>
  <div class="flex flex-col">
    <div class="-m-1.5 overflow-x-auto">
      <div class="inline-block p-1.5 min-w-full align-middle">
        <!-- Top Action Buttons -->
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

        <!-- Table -->
        <div class="overflow-x-auto overflow-y-visible">
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
                  v-for="col in columns as any"
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
                v-for="(row, rowIdx) in data as any"
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
                  v-for="col in columns as any"
                  :key="col.key"
                  :class="[ 
                    'px-6 py-4 text-sm whitespace-nowrap',
                    col.align === 'end'
                      ? 'text-end font-medium'
                      : 'font-medium',
                  ]"
                >
                  <!-- Profile Image -->
                  <template v-if="col.key === 'profile_image'">
                    <div class="flex items-center justify-center">
                      <img
                        v-if="row[col.key]"
                        :src="row[col.key]"
                        :alt="`${row.first_name} ${row.last_name}`"
                        class="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        @error="handleImageError"
                      />
                      <div
                        v-else
                        class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm"
                      >
                        {{ getInitials(row.first_name, row.last_name) }}
                      </div>
                    </div>
                  </template>

                  <!-- Action Menu -->
                  <template v-else-if="col.key === 'action'">
                    <DropdownMenu
                      :options="[
                        {
                          label: 'Edit',
                          icon: 'material-symbols:edit',
                          action: 'edit'
                        },
                        {
                          label: 'Delete',
                          icon: 'material-symbols:delete',
                          action: 'delete',
                          class: 'text-red-500'
                        }
                      ]"
                      @action="(action: any) => handleRowAction(action, row)"
                      
                    />
                  </template>

                  <!-- Status Badge -->
                  <template v-else-if="col.key === 'status'">
                    <div
                      :class="`px-3 py-1 text-sm w-fit text-darkBackground rounded-full font-medium ${
                        row.status === 'Active' || row.status == 'Paid'
                          ? 'bg-green-400'
                          : 'bg-yellow-400'
                      }`"
                    >
                      {{ row[col.key] }}
                    </div>
                  </template>

                  <!-- Normal Cell -->
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

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

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

const selectedRows = ref<number[]>([]);

const allSelected = computed(
  () => selectedRows.value.length === props.data.length && props.data.length > 0
);

function toggleSelectAll(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.checked) {
    selectedRows.value = props.data.map((_, idx) => idx);
  } else {
    selectedRows.value = [];
  }
}

function emitSelectedAction() {
  const selectedData = selectedRows.value.map((idx) => props.data[idx]);
  emit("selected-action", selectedData);
}

const emit = defineEmits(["selected-action", "action", "delete"]);

// at top of script

const router = useRouter();

// inside functions
function handleRowAction(action: string, row: any) {
  if (action === "edit") {
    emit("action", { action: "edit", row });
    return;
  }

  if (action === "delete") {
    emit("delete", row);
    return;
  }

  // any other action
  emit("action", { action, row });
}



// Helper to show initials if no image
function getInitials(firstName: string, lastName: string): string {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last || '?';
}

// Hide broken images
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
}
</script>
